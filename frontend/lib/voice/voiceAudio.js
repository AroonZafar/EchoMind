/**
 * voiceAudio.js — Browser ES module
 *
 * Step 7: Connects the microphone MediaStream (from microphone.js) to the
 * AssemblyAI Voice Agent WebSocket (via voiceAgent.sendAudio).
 *
 * Pipeline:
 *   MediaStream  →  AudioContext (24 kHz)  →  MediaStreamSourceNode
 *     →  AudioWorkletNode (pcm-processor)  →  base64 encode
 *       →  sendAudio(base64)  →  WebSocket  →  AssemblyAI
 *
 * Audio format: PCM16 · mono · 24 kHz (required by AssemblyAI Voice Agent)
 *
 * Guards:
 *   - Audio is only sent AFTER session.ready (caller must call startStreaming
 *     from the onSessionReady handler or pass sessionReady=true).
 *   - Audio is not sent if the WebSocket is not open.
 *   - Streaming stops cleanly when stopStreaming() is called.
 *
 * Public API:
 *   startStreaming(stream)  → Promise<void>
 *   stopStreaming()         → void
 *   isStreaming()           → boolean
 */

import { sendAudio, isConnected } from "./voiceAgent.js";
import { getMicrophoneStream }    from "./microphone.js";
import { isAudioPlaying }         from "./replyAudio.js";

/** Path to the AudioWorklet processor module — served by the static server */
const PROCESSOR_URL = "/voice/pcm-processor.js";

/** @type {AudioContext|null} */
let audioCtx = null;

/** @type {AudioWorkletNode|null} */
let workletNode = null;

/** @type {MediaStreamAudioSourceNode|null} */
let sourceNode = null;

/** @type {boolean} */
let streaming = false;

/** Frame counter — used only for infrequent logging (every 100 frames) */
let frameCount = 0;

/**
 * Convert an ArrayBuffer of Int16 PCM samples to a base64 string.
 * Uses Uint8Array view over the same buffer — no copy needed.
 *
 * @param {ArrayBuffer} buffer
 * @returns {string} base64-encoded bytes
 */
function pcmBufferToBase64(buffer) {
  const bytes = new Uint8Array(buffer);
  const CHUNK = 0x8000;
  let binary = "";
  for (let i = 0; i < bytes.byteLength; i += CHUNK) {
    binary += String.fromCharCode.apply(null, bytes.subarray(i, i + CHUNK));
  }
  return btoa(binary);
}

/** Send ~40 ms per WebSocket message (960 samples at 24 kHz) instead of 128-sample frames. */
const BATCH_SAMPLES = 960;

/**
 * Half-duplex mode: while the agent's reply is playing (plus a short tail),
 * send silence instead of the real microphone signal. Without this the
 * speakers leak into the mic, the server thinks the user started talking,
 * marks the reply "interrupted", and the client throws the rest of the
 * audio away -- which is heard as the voice cutting out.
 * Set to false to allow barge-in (interrupting the agent), e.g. when the
 * user wears headphones.
 */
const MUTE_MIC_WHILE_AGENT_SPEAKS = true;
const MUTE_TAIL_MS = 600;
let lastAgentAudioAt = 0;

function agentIsSpeaking() {
  const now = performance.now();
  if (isAudioPlaying()) {
    lastAgentAudioAt = now;
    return true;
  }
  return now - lastAgentAudioAt < MUTE_TAIL_MS;
}

/** @type {Int16Array[]} */
let pendingFrames = [];
let pendingSamples = 0;

function flushPending() {
  if (pendingSamples === 0) return;
  const merged = new Int16Array(pendingSamples);
  let offset = 0;
  for (const frame of pendingFrames) {
    merged.set(frame, offset);
    offset += frame.length;
  }
  pendingFrames = [];
  pendingSamples = 0;
  // Keep the stream continuous (zeros) rather than pausing it.
  if (MUTE_MIC_WHILE_AGENT_SPEAKS && agentIsSpeaking()) merged.fill(0);
  sendAudio(pcmBufferToBase64(merged.buffer));
}

/**
 * Start streaming microphone audio to AssemblyAI.
 * Must be called AFTER session.ready — caller is responsible for this gate.
 *
 * @returns {Promise<void>} Resolves when the audio pipeline is set up.
 * @throws {Error} If the microphone stream is unavailable or AudioWorklet fails.
 */
async function startStreaming() {
  if (streaming) {
    console.warn("[voiceAudio] Already streaming — ignoring startStreaming().");
    return;
  }

  const stream = getMicrophoneStream();
  if (!stream) {
    throw new Error("[voiceAudio] No microphone stream available. Call startMicrophone() first.");
  }

  if (!isConnected()) {
    throw new Error("[voiceAudio] WebSocket not connected. Call connect() first.");
  }

  // Create an AudioContext at 24 kHz — AssemblyAI Voice Agent required rate.
  // The browser will resample from the native device rate automatically.
  try {
    audioCtx = new AudioContext({ sampleRate: 24000 });
  } catch (err) {
    throw new Error("[voiceAudio] AudioContext creation failed: " + err.message);
  }

  // Resume the context if the browser suspended it (autoplay policy).
  if (audioCtx.state === "suspended") {
    await audioCtx.resume();
  }

  // Load the PCM processor into the AudioWorklet.
  try {
    await audioCtx.audioWorklet.addModule(PROCESSOR_URL);
  } catch (err) {
    audioCtx.close();
    audioCtx = null;
    throw new Error("[voiceAudio] AudioWorklet addModule failed: " + err.message);
  }

  // Wire: MediaStream → source → worklet
  sourceNode  = audioCtx.createMediaStreamSource(stream);
  workletNode = new AudioWorkletNode(audioCtx, "pcm-processor");

  // Each message from the worklet is one 128-sample PCM16 ArrayBuffer.
  workletNode.port.onmessage = (event) => {
    if (!streaming || !isConnected()) {
      return;
    }

    const frame = new Int16Array(event.data);
    pendingFrames.push(frame);
    pendingSamples += frame.length;
    if (pendingSamples >= BATCH_SAMPLES) {
      flushPending();
    }

    frameCount++;
    // Log once per 100 frames (~0.5 s at 24 kHz / 128 samples per frame)
    if (frameCount % 100 === 0) {
      console.log("[voiceAudio] audio frame sent (frame", frameCount, ")");
    }
  };

  workletNode.port.onmessageerror = (err) => {
    console.error("[voiceAudio] WorkletNode message error:", err);
  };

  // Connect the graph — do NOT connect workletNode to audioCtx.destination
  // (we have no need to play back the microphone audio locally).
  sourceNode.connect(workletNode);

  pendingFrames = [];
  pendingSamples = 0;
  streaming  = true;
  frameCount = 0;
  console.log("[voiceAudio] microphone streaming started");
}

/**
 * Stop streaming and release all audio-processing resources.
 * Safe to call even if streaming is not active.
 */
function stopStreaming() {
  if (!streaming && !audioCtx) {
    return;
  }

  streaming = false;
  pendingFrames = [];
  pendingSamples = 0;

  // Disconnect the audio graph
  if (sourceNode) {
    try { sourceNode.disconnect(); } catch (_) { /* already disconnected */ }
    sourceNode = null;
  }
  if (workletNode) {
    workletNode.port.onmessage = null;
    try { workletNode.disconnect(); } catch (_) { /* already disconnected */ }
    workletNode = null;
  }
  if (audioCtx) {
    audioCtx.close().catch(() => {});
    audioCtx = null;
  }

  frameCount = 0;
  console.log("[voiceAudio] microphone streaming stopped");
}

/**
 * Returns true if the audio pipeline is active.
 * @returns {boolean}
 */
function isStreaming() {
  return streaming;
}

export { startStreaming, stopStreaming, isStreaming };

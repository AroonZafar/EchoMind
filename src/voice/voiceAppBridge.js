/**
 * voiceAppBridge.js — Browser ES module
 *
 * Wires the #micButton and status DOM elements to voiceAgent.js,
 * microphone.js, and voiceAudio.js.
 *
 * Button click flow:
 *   START: startMicrophone() → connect() → [session.ready] → startStreaming()
 *   STOP:  stopStreaming() → stopMicrophone() → disconnect()
 *
 * Audio streaming begins ONLY after session.ready — never before.
 * Step 8: User transcript events are received and displayed in #transcriptList.
 * Step 10: Agent reply audio is handed to the separate replyAudio module.
 * Interruption logic remains deferred to Step 11.
 */

import { connect, disconnect, isConnected } from "./voiceAgent.js";
import {
  startMicrophone,
  stopMicrophone,
  isMicrophoneActive,
} from "./microphone.js";
import { startStreaming, stopStreaming } from "./voiceAudio.js";
import {
  prepareReplyAudio,
  playReplyAudio,
  flushReplyAudio,
  stopReplyAudio,
} from "./replyAudio.js";

const micButton      = document.getElementById("micButton");
const voiceStatus    = document.getElementById("voiceStatus");
const micStatus      = document.getElementById("micStatus");
const transcriptList = document.getElementById("transcriptList");

// ── Step 8: Live user transcript state ─────────────────────────────────────
/** The in-progress bubble element shown while the user is still speaking */
let partialTurnEl = null;

/**
 * Accumulated delta words for the current in-progress user utterance.
 * transcript.user.delta fires one word at a time; we join them with spaces
 * so the bubble shows a growing sentence rather than a single word.
 */
let partialAccumulated = "";

/** The in-progress bubble element shown while the agent is responding */
let agentTurnEl = null;

/** Accumulated delta text for the current agent response */
let agentAccumulated = "";

/**
 * Handle a user-speech transcript event from voiceAgent.js.
 *
 * isFinal=false  →  transcript.user.delta  (one new word in `text`)
 *                   Appends the word to the running partial and updates the bubble.
 * isFinal=true   →  transcript.user  (complete utterance in `text`)
 *                   Removes the partial bubble and commits the final text to the
 *                   existing appendTranscript() function from app.js.
 *
 * @param {string}  text     New word (partial) or full sentence (final).
 * @param {boolean} isFinal  True when AssemblyAI has committed the utterance.
 */
function handleUserTranscript({ text, isFinal }) {
  if (!transcriptList) return;

  if (!isFinal) {
    // Accumulate delta words into a growing sentence.
    partialAccumulated = partialAccumulated
      ? partialAccumulated + " " + text
      : text;

    // Create the partial bubble on the first word.
    if (!partialTurnEl) {
      partialTurnEl = document.createElement("div");
      partialTurnEl.className = "turn user";
      partialTurnEl.innerHTML =
        '<span class="turn-avatar">You</span>' +
        '<div class="turn-bubble"><span class="turn-text"></span></div>';
      transcriptList.appendChild(partialTurnEl);
    }
    const textSpan = partialTurnEl.querySelector(".turn-text");
    if (textSpan) textSpan.textContent = partialAccumulated;
    transcriptList.scrollTop = transcriptList.scrollHeight;
    return;
  }

  // Final: discard the partial bubble and reset accumulator.
  if (partialTurnEl) {
    partialTurnEl.remove();
    partialTurnEl = null;
  }
  partialAccumulated = "";

  // Commit via appendTranscript() — global function defined in app.js.
  if (typeof appendTranscript === "function") {
    appendTranscript(text, "user");
  } else {
    // Fallback: build the turn manually if app.js is not yet loaded.
    const turn = document.createElement("div");
    turn.className = "turn user";
    turn.innerHTML =
      '<span class="turn-avatar">You</span>' +
      `<div class="turn-bubble"><span class="turn-text">${text}</span></div>`;
    transcriptList.appendChild(turn);
  }
  transcriptList.scrollTop = transcriptList.scrollHeight;
  console.log("[voiceAppBridge] final user transcript:", text);
}

function handleAgentResponse({ text, isFinal }) {
  if (!transcriptList) return;

  if (!isFinal) {
    const needsSpace =
      agentAccumulated &&
      !/\s$/.test(agentAccumulated) &&
      !/^[.,!?;:)]/.test(text);
    agentAccumulated += `${needsSpace ? " " : ""}${text}`;

    if (!agentTurnEl) {
      agentTurnEl = document.createElement("div");
      agentTurnEl.className = "turn agent";
      agentTurnEl.innerHTML =
        '<span class="turn-avatar">Echo</span>' +
        '<div class="turn-bubble"><span class="turn-text"></span></div>';
      transcriptList.appendChild(agentTurnEl);
    }

    const textSpan = agentTurnEl.querySelector(".turn-text");
    if (textSpan) textSpan.textContent = agentAccumulated;
    transcriptList.scrollTop = transcriptList.scrollHeight;
    return;
  }

  if (agentTurnEl) {
    agentTurnEl.remove();
    agentTurnEl = null;
  }
  agentAccumulated = "";

  if (typeof appendTranscript === "function") {
    appendTranscript(text, "agent");
  }
  transcriptList.scrollTop = transcriptList.scrollHeight;
  console.log("[voiceAppBridge] final agent response:", text);
}

function setVoiceStatus(text) {
  if (voiceStatus) voiceStatus.textContent = text;
}

function setMicStatus(text) {
  if (micStatus) micStatus.textContent = `Microphone: ${text}`;
}

micButton.addEventListener("click", async () => {
  // ── STOP path ──────────────────────────────────────────────────────────────
  if (isConnected() || isMicrophoneActive()) {
    stopStreaming();
    stopMicrophone();
    stopReplyAudio();
    setMicStatus("Off");
    disconnect();
    setVoiceStatus("Voice: Disconnected");
    return;
  }

  // ── START path ─────────────────────────────────────────────────────────────
  setVoiceStatus("Voice: Connecting…");
  setMicStatus("Starting…");

  // Prepare speaker output from the same user gesture as microphone access.
  prepareReplyAudio();

  // 1. Request microphone permission (Step 6).
  try {
    await startMicrophone();
    setMicStatus("On");
    console.log("[voiceAppBridge] Microphone active.");
  } catch (err) {
    console.error("[voiceAppBridge] Microphone error:", err.message);
    if (err.name === "NotAllowedError" || err.name === "PermissionDeniedError") {
      setMicStatus("Permission denied");
    } else if (err.name === "NotFoundError" || err.name === "DevicesNotFoundError") {
      setMicStatus("Unavailable");
    } else {
      setMicStatus("Error");
    }
    setVoiceStatus("Voice: Error");
    return;
  }

  // 2. Open the AssemblyAI WebSocket; start streaming on session.ready (Steps 7–8).
  try {
    await connect({
      onSessionReady: async () => {
        setVoiceStatus("Voice: Connected");
        // Gate: only start streaming once the session is confirmed ready.
        try {
          await startStreaming();
        } catch (err) {
          console.error("[voiceAppBridge] startStreaming failed:", err.message);
          setMicStatus("Error");
        }
      },
      // Step 8: receive and display user speech transcript.
      onUserTranscript: handleUserTranscript,
      // Step 9: receive and display the live agent response text.
      onAgentResponse: handleAgentResponse,
      // Step 10: queue live PCM16 reply audio for speaker playback.
      onAgentAudio: (data) => playReplyAudio(data),
      // Step 11: AssemblyAI detected a user barge-in.
      onReplyInterrupted: () => flushReplyAudio(),
      onError: () => {
        setVoiceStatus("Voice: Error");
        stopStreaming();
        stopMicrophone();
        stopReplyAudio();
        setMicStatus("Off");
        // Clear any dangling partial bubble and accumulator on error.
        if (partialTurnEl) { partialTurnEl.remove(); partialTurnEl = null; }
        partialAccumulated = "";
        if (agentTurnEl) { agentTurnEl.remove(); agentTurnEl = null; }
        agentAccumulated = "";
      },
      onClose: () => {
        // Stop streaming when the WebSocket closes unexpectedly.
        stopStreaming();
        stopReplyAudio();
        if (voiceStatus && voiceStatus.textContent === "Voice: Connected") {
          setVoiceStatus("Voice: Disconnected");
        }
        // Clear any dangling partial bubble and accumulator on disconnect.
        if (partialTurnEl) { partialTurnEl.remove(); partialTurnEl = null; }
        partialAccumulated = "";
        if (agentTurnEl) { agentTurnEl.remove(); agentTurnEl = null; }
        agentAccumulated = "";
      },
    });
  } catch (err) {
    console.error("[voiceAppBridge] connect failed:", err.message);
    setVoiceStatus("Voice: Error");
    stopStreaming();
    stopMicrophone();
    stopReplyAudio();
    setMicStatus("Off");
    if (agentTurnEl) { agentTurnEl.remove(); agentTurnEl = null; }
    agentAccumulated = "";
  }
});

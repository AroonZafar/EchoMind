/**
 * replyAudio.js — Browser ES module
 *
 * Decodes and schedules AssemblyAI reply.audio PCM16 chunks for playback.
 * This output path is intentionally separate from microphone capture and
 * microphone streaming.
 */

const SAMPLE_RATE = 24000;

/** @type {AudioContext|null} */
let audioContext = null;

/** @type {number} */
let nextStartTime = 0;

/** @type {number} */
let queuedSources = 0;

/** @type {Set<AudioBufferSourceNode>} */
const activeSources = new Set();

function getAudioContext() {
  if (!audioContext) {
    audioContext = new AudioContext({ sampleRate: SAMPLE_RATE });
  }
  return audioContext;
}

/**
 * Prepare the output context during the user's Voice button gesture.
 * A suspended context is harmless: scheduled buffers wait until it resumes.
 *
 * @returns {Promise<boolean>} true when playback can be attempted
 */
async function prepareReplyAudio() {
  try {
    const context = getAudioContext();
    if (context.state === "suspended") {
      await context.resume();
    }
    return context.state === "running";
  } catch (error) {
    console.warn("[replyAudio] Audio output is unavailable:", error.message);
    return false;
  }
}

function decodePcm16Base64(base64Audio) {
  const binary = atob(base64Audio);
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index++) {
    bytes[index] = binary.charCodeAt(index);
  }

  const sampleCount = Math.floor(bytes.byteLength / 2);
  const samples = new Int16Array(
    bytes.buffer,
    bytes.byteOffset,
    sampleCount
  );
  const audioBuffer = getAudioContext().createBuffer(
    1,
    sampleCount,
    SAMPLE_RATE
  );
  const channel = audioBuffer.getChannelData(0);

  for (let index = 0; index < sampleCount; index++) {
    channel[index] = samples[index] < 0
      ? samples[index] / 32768
      : samples[index] / 32767;
  }

  return audioBuffer;
}

/**
 * Queue one base64-encoded PCM16 mono 24 kHz reply chunk.
 * Chunks are scheduled end-to-end so they cannot overlap or reorder.
 *
 * @param {string} base64Audio Audio data from reply.audio.data
 * @returns {boolean} true when the chunk was scheduled
 */
function playReplyAudio(base64Audio) {
  if (!base64Audio) return false;

  try {
    const context = getAudioContext();
    const buffer = decodePcm16Base64(base64Audio);
    const source = context.createBufferSource();
    source.buffer = buffer;
    source.connect(context.destination);

    const startTime = Math.max(context.currentTime, nextStartTime);
    source.start(startTime);
    nextStartTime = startTime + buffer.duration;
    queuedSources++;
    activeSources.add(source);
    source.onended = () => {
      queuedSources = Math.max(0, queuedSources - 1);
      activeSources.delete(source);
    };
    console.log("[replyAudio] PCM16 chunk scheduled", {
      samples: buffer.length,
      queued: queuedSources,
      contextState: context.state,
    });
    return true;
  } catch (error) {
    console.warn("[replyAudio] Could not schedule audio chunk:", error.message);
    return false;
  }
}

/**
 * Stop every scheduled source and reset scheduling to the current audio time.
 */
function flushReplyAudio() {
  for (const source of activeSources) {
    try {
      source.stop();
    } catch (_) {
      // The source may have already ended.
    }
    source.disconnect();
  }
  activeSources.clear();
  nextStartTime = audioContext ? audioContext.currentTime : 0;
  queuedSources = 0;
}

function stopReplyAudio() {
  flushReplyAudio();
}

function isAudioPlaying() {
  return queuedSources > 0;
}

export {
  prepareReplyAudio,
  playReplyAudio,
  flushReplyAudio,
  stopReplyAudio,
  isAudioPlaying,
};

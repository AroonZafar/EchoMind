/**
 * microphone.js — Browser ES module
 *
 * Manages browser microphone capture via the MediaDevices API.
 * This module does NOT send any audio anywhere — it only opens and
 * releases the MediaStream. Audio streaming is handled in a future step.
 *
 * Public API:
 *   startMicrophone()      → Promise<void>
 *   stopMicrophone()       → void
 *   isMicrophoneActive()   → boolean
 *   getMicrophoneStream()  → MediaStream|null
 */

/** @type {MediaStream|null} */
let micStream = null;

/**
 * Request microphone permission and open a MediaStream.
 * Stores the stream internally; does NOT send audio anywhere.
 *
 * @returns {Promise<void>} Resolves when the stream is open.
 * @throws {Error} If permission is denied or the API is unavailable.
 */
async function startMicrophone() {
  if (micStream) {
    // Already active — nothing to do.
    return;
  }

  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    throw new Error("MediaDevices API is not available in this browser.");
  }

  // This is the ONLY audio acquisition call for Step 6.
  // No audio data is read or forwarded here.
  micStream = await navigator.mediaDevices.getUserMedia({ audio: true });
  console.log(
    "[microphone] Stream open — tracks:",
    micStream.getAudioTracks().length
  );
}

/**
 * Stop all microphone tracks and release the hardware.
 * After this call isMicrophoneActive() returns false.
 */
function stopMicrophone() {
  if (!micStream) {
    return;
  }
  micStream.getTracks().forEach((track) => track.stop());
  micStream = null;
  console.log("[microphone] Stream stopped and released.");
}

/**
 * Returns true if the microphone stream is currently open.
 * @returns {boolean}
 */
function isMicrophoneActive() {
  return micStream !== null;
}

/**
 * Returns the active MediaStream, or null if none.
 * Intended for future audio-streaming steps ONLY — do not use in Step 6 UI code.
 * @returns {MediaStream|null}
 */
function getMicrophoneStream() {
  return micStream;
}

export { startMicrophone, stopMicrophone, isMicrophoneActive, getMicrophoneStream };

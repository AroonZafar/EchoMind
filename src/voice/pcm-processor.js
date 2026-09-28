/**
 * pcm-processor.js — AudioWorklet processor
 *
 * Runs in the AudioWorklet thread (separate from the main JS thread).
 * Receives Float32 microphone samples, converts them to signed Int16 PCM,
 * and transfers the raw bytes back to the main thread via postMessage.
 *
 * Target format: PCM16 · mono · 24 kHz
 * (AudioContext is created at 24000 Hz in voiceAudio.js; the browser
 *  resamples from the native microphone rate to match.)
 *
 * This file must NOT use ES module import/export — AudioWorklet processors
 * are loaded via addModule() and run in a WorkletGlobalScope.
 */

class PcmProcessor extends AudioWorkletProcessor {
  /**
   * Called by the browser for every 128-sample render quantum.
   *
   * @param {Float32Array[][]} inputs   - inputs[0][0] = mono channel
   * @param {Float32Array[][]} _outputs - unused
   * @returns {boolean} true = keep processor alive
   */
  process(inputs) {
    const channel = inputs[0] && inputs[0][0];
    if (!channel || channel.length === 0) {
      return true;
    }

    // Convert Float32 [-1, 1] → Int16 [-32768, 32767]
    const int16 = new Int16Array(channel.length);
    for (let i = 0; i < channel.length; i++) {
      // Clamp to [-1, 1] before scaling to avoid overflow
      const clamped = Math.max(-1, Math.min(1, channel[i]));
      int16[i] = clamped < 0 ? clamped * 32768 : clamped * 32767;
    }

    // Transfer the underlying ArrayBuffer (zero-copy) to the main thread.
    // The main thread handler in voiceAudio.js reads it, base64-encodes it,
    // and sends it to AssemblyAI as input.audio.
    this.port.postMessage(int16.buffer, [int16.buffer]);

    return true; // returning false would destroy the processor
  }
}

registerProcessor("pcm-processor", PcmProcessor);

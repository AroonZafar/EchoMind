/**
 * AudioWorklet processor for 24 kHz mono PCM16 microphone capture.
 */

class PcmProcessor extends AudioWorkletProcessor {
  process(inputs) {
    const channel = inputs[0] && inputs[0][0];
    if (!channel || channel.length === 0) {
      return true;
    }

    const int16 = new Int16Array(channel.length);
    for (let index = 0; index < channel.length; index++) {
      const clamped = Math.max(-1, Math.min(1, channel[index]));
      int16[index] = clamped < 0 ? clamped * 32768 : clamped * 32767;
    }

    this.port.postMessage(int16.buffer, [int16.buffer]);
    return true;
  }
}

registerProcessor("pcm-processor", PcmProcessor);

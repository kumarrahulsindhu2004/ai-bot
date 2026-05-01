export class AudioBuffer {
  constructor() {
    this.chunks = [];
  }

  addChunk(base64) {
    this.chunks.push(Buffer.from(base64, "base64"));
  }

  getCombined() {
    return Buffer.concat(this.chunks);
  }

  clear() {
    this.chunks = [];
  }
}
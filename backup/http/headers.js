export class Headers {
  constructor(hash) {
    this.hash = hash;
  }
  keys() {
    return Object.keys(this.hash);
  }
  get(key) {
    return this.hash[key];
  }
}

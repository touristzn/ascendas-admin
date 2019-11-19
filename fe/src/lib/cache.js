export default class Cache {
  constructor() {
    this.data = {};
  }

  set(key, value) {
    this.data[key] = value;
  }

  get(key) {
    if (typeof this.data[key] === 'undefined') return null;
    return this.data[key];
  }

  push(key, value) {
    this.data[key] = value;
  }

  pop(key) {
    if (typeof this.data[key] === 'undefined') return null;
    let value = this.data[key];
    this.clear(key);
    return value;
  }

  clear(key) {
    this.data[key] = null;
  }
}
export class InMemoryStorage {
  constructor(bus) {
    this.events = [];
    bus.registerForAll(this);
  }
  update(value, key) {
    this.events.push({ key, value });
  }
}

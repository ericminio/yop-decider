export class InMemoryEvents {
  constructor(bus) {
    this.events = [];
    bus.registerForAll(this);
  }
  update(value, key) {
    this.events.push({ event: key, data: value });
  }
}

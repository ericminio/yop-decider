export class InMemoryEvents {
  constructor(bus) {
    this.events = [];
    bus.registerForAll(this);
  }
  update(value, key) {
    this.events.push({ event: key, source: value });
  }

  async getAllPropositions() {
    return this.events
      .filter(({ event }) => event === "proposition.created")
      .map(({ source }) => source);
  }

  async getAllUsers() {
    return this.events
      .filter(({ event }) => event === "user.created")
      .map(({ source }) => source);
  }
}

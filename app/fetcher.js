class EventsFetcher {
  constructor(bus) {
    this.bus = bus;
    this.bus.register(this.execute.bind(this), "events.requested");
  }

  async execute() {
    const response = await fetch("/events");
    const data = await response.json();
    const propositions = data.events
      .filter(({ event }) => event === "proposition.created")
      .map(
        ({ data }) =>
          new Proposition({
            text: data.text,
            owner: data.owner,
          }),
      );
    this.bus.notify("events.fetched", { propositions });
  }
}

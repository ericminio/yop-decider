class EventsFetcher {
  constructor(bus) {
    this.bus = bus;
    this.bus.register(this.execute.bind(this), /\.requested$/);
  }

  async execute() {
    const response = await fetch("/events");
    const data = await response.json();
    const users = data.events
      .filter(({ key }) => key === "user.created")
      .map(
        ({ value }) =>
          new User(
            {
              name: value.name,
            },
            this.bus,
          ),
      );
    data.events
      .filter(({ key }) => key === "proposition.created")
      .map(
        ({ value }) =>
          new Proposition(
            {
              text: value.text,
              owner: users.find((user) => user.name === value.owner),
            },
            this.bus,
          ),
      );
  }
}

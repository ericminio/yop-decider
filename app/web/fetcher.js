class EventsFetcher {
  constructor(bus) {
    this.bus = bus;
    this.bus.register(this.execute.bind(this), /\.requested$/);
    this.store = yopDomainStorage;
  }

  execute() {
    fetch("/events")
      .then((response) => response.json())
      .then((data) => {
        const users = data.events
          .filter(({ key }) => key === "user.created")
          .map(
            ({ value }) =>
              new User({
                id: value.id,
              }),
          );
        const propositions = data.events
          .filter(({ key }) => key === "proposition.created")
          .map(
            ({ value }) =>
              new Proposition({
                text: value.text,
                owner: users.find((user) => user.id === value.owner),
              }),
          );
        propositions.forEach((proposition) => {
          proposition.bus = this.bus;
          this.store.saveObject(proposition.id(), proposition);
        });
        this.bus.notify("events.fetched", { propositions });
      })
      .catch((error) => {
        this.bus.notify("error.occurred", error.message);
      });
  }
}

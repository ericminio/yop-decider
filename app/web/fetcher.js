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
                name: value.name,
              }),
          );
        const propositions = data.events
          .filter(({ key }) => key === "proposition.created")
          .map(
            ({ value }) =>
              new Proposition({
                text: value.text,
                owner: users.find((user) => user.name === value.owner),
              }),
          );
        data.events
          .filter(({ key }) => key === "user.voted")
          .forEach(({ value }) => {
            const { proposition: text, voter, choice } = value;
            const user = users.find((u) => u.name === voter);
            const proposition = propositions.find((p) => p.text === text);
            user.vote(choice, proposition);
          });
        propositions.forEach((proposition) => {
          proposition.bus = this.bus;
          proposition.owner.bus = this.bus;
          this.store.saveObject(proposition.text, proposition);
        });
        this.bus.notify("events.fetched", { propositions });
      })
      .catch((error) => {
        this.bus.notify("error.occurred", error.message);
      });
  }
}

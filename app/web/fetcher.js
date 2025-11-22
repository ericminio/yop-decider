class EventsFetcher {
  constructor(bus) {
    this.bus = bus;
    this.bus.register(this.execute.bind(this), /\.requested$/);
    this.store = yopDomainStorage;
  }

  async execute() {
    try {
      this.bus.pauseNotifications = true;
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
      const propositions = [];
      data.events
        .filter(({ key }) => key === "proposition.created")
        .map(({ value }) => {
          const proposition = new Proposition(
            {
              text: value.text,
              owner: users.find((user) => user.name === value.owner),
            },
            this.bus,
          );
          propositions.push(proposition);
          this.store.saveObject(value.text, proposition);
          return proposition;
        });
      data.events
        .filter(({ key }) => key === "user.voted")
        .forEach(({ value }) => {
          const { proposition: text, voter, vote } = value;
          const user = users.find((u) => u.name === voter);
          const proposition = propositions.find((p) => p.text === text);
          proposition.vote(user, vote);
        });
      this.bus.pauseNotifications = false;
      this.bus.notify("events.fetched", { users, propositions });
    } catch (error) {
      this.bus.pauseNotifications = false;
      this.bus.notify("error.occurred", error.message);
    }
  }
}

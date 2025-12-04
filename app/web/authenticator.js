class Authenticator {
  constructor(bus) {
    this.bus = bus;
    this.localStorage = yopLocalStorage;
    this.store = yopDomainStorage;
    this.bus.register(this.authenticate.bind(this), "login.requested");
    this.bus.register(this.challenge.bind(this), "user.challenged");
  }

  authenticate({ name, password }) {
    const encoded = window.btoa(JSON.stringify({ name, password }));
    fetch("/authenticate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: encoded,
    })
      .then((response) => {
        if (response.ok) {
          const user = new User({ name });
          this.localStorage.saveObject("user", user);
          this.bus.notify("login.successful");
        } else {
          if (response.status === 401) {
            this.bus.notify("login.failed");
          } else {
            this.bus.notify("error.occurred", response.statusText);
          }
        }
      })
      .catch((e) => {
        this.bus.notify("error.occurred", `authentication (${e.message})`);
        this.bus.notify("login.failed");
      });
  }

  challenge() {
    const storedUser = this.localStorage.getObject("user");
    if (!!storedUser) {
      const user = new User(storedUser);
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
                  owner: users.find((user) => user.id() === value.owner),
                }),
            );
          data.events
            .filter(
              ({ key, value }) =>
                key === "user.voted" && value.voter === user.id(),
            )
            .forEach(({ value }) => {
              const { proposition: text, choice } = value;
              const proposition = propositions.find((p) => p.text === text);
              user.vote(choice, proposition);
            });
          user.bus = this.bus;
          this.store.saveObject(user.id(), user);
          this.bus.notify("user.authorized");
        })
        .catch((error) => {
          this.bus.notify("error.occurred", error.message);
        });
    }
  }
}

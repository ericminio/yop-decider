class Authenticator {
  constructor(bus) {
    this.bus = bus;
    this.localStorage = yopLocalStorage;
    this.store = yopDomainStorage;
    this.bus.register(this.authenticate.bind(this), "login.requested");
    this.bus.register(this.instantiate.bind(this), "user.challenged");
    this.userFetchINProgress = false;
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

  instantiate() {
    const userInLocalStorage = this.localStorage.getObject("user");
    if (!!userInLocalStorage) {
      const userInStore = this.store.getObject(
        new User(userInLocalStorage).id(),
      );
      if (!!userInStore) {
        this.bus.notify("user.authorized", userInStore);
        return;
      }
      if (this.userFetchINProgress) {
        return;
      }
      this.userFetchINProgress = true;
      const user = new User(userInLocalStorage);
      fetch("/events")
        .then((response) => response.json())
        .then((data) => {
          data.events
            .filter(
              ({ key, value }) =>
                key === "user.voted" && value.voter === user.id(),
            )
            .forEach(({ value }) => {
              const { proposition: text, choice } = value;
              user.vote(choice, new Proposition({ text }));
            });
          user.bus = this.bus;
          this.store.saveObject(user.id(), user);
          this.bus.notify("user.authorized", user);
          this.userFetchINProgress = false;
        })
        .catch((error) => {
          this.bus.notify("error.occurred", error.message);
        });
    }
  }
}

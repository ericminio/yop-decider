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
          user.bus = this.bus;
          this.store.saveObject(user.id(), user);
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
    if (storedUser !== null) {
      const user = new User(storedUser);
      user.bus = this.bus;
      this.store.saveObject(user.id(), user);
      this.bus.notify("user.authorized");
    }
  }
}

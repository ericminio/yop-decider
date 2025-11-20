class Authenticator {
  constructor(bus) {
    this.bus = bus;
    this.bus.register(this.execute.bind(this), "login.requested");
  }

  async execute({ name, password }) {
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
          this.bus.notify("login.successful", new User({ name }));
        } else {
          this.bus.notify("login.failed");
        }
      })
      .catch(() => {
        this.bus.notify("login.failed");
      });
  }
}

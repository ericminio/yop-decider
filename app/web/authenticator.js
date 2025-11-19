class Authenticator {
  constructor(bus) {
    this.bus = bus;
    this.bus.register(this.execute.bind(this), "login.requested");
  }

  async execute({ name, password }) {
    if (name === "Charlie") {
      this.bus.notify("login.successful");
    } else {
      this.bus.notify("login.failed");
    }
  }
}

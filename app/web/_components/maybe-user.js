class MaybeUserElement extends YopElement {
  constructor() {
    super();
    this.user = null;
  }

  async wire() {
    await this.render();

    this.listenerId = this.bus.register(
      this.updatedUser.bind(this),
      "user.authorized",
    );
    this.notify("user.challenged");
  }

  async render() {
    throw new Error("render() method not implemented");
  }

  updatedUser(user) {
    this.bus.unregister(this.listenerId);
    this.user = user;
    this.update();
  }

  update() {
    throw new Error("update() method not implemented");
  }
}

class MaybeUserElement extends YopElement {
  constructor() {
    super();
    this.user = null;
  }

  updatedUser(user) {
    if (!this.user) {
      this.user = user;
      this.update();
    }
  }

  update() {
    throw new Error("update() method not implemented");
  }
}

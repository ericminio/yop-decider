class MaybeUserElement extends YopElement {
  constructor() {
    super();
  }

  getUser() {
    const storedUser = this.localStorage.getObject("user");
    if (!!storedUser) {
      this.user = this.store.getObject(new User(storedUser).id());
      if (!this.user) {
        this.notify("user.challenged");
      }
    } else {
      this.user = null;
    }
  }
}

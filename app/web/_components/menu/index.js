customElements.define(
  "yop-menu",
  class extends YopElement {
    static template = "/templates/_components/menu/index.html";

    async wire() {
      this.querySelector("#propose").addEventListener("click", () => {
        navigate.to("/new");
      });
      this.querySelector("#login").addEventListener("click", () => {
        navigate.to("/login?then=/");
      });
      this.querySelector("#logout").addEventListener("click", () => {
        this.localStorage.delete("user");
        this.update();
        navigate.to("/");
      });
      this.registerListener(this.update.bind(this), "user.authorized");
      this.update();
    }

    getUser() {
      const storedUser = this.localStorage.getObject("user");
      if (storedUser !== null) {
        this.user = this.store.getObject(new User(storedUser).id());
        if (this.user === null) {
          this.notify("user.challenged");
        }
      } else {
        this.user = null;
      }
    }

    update() {
      this.getUser();
      this.updateDisplay();
    }

    updateDisplay() {
      const isUserLoggedIn = this.user !== null;
      this.querySelector("#login").classList.toggle("hidden", isUserLoggedIn);
      this.querySelector("#logout").classList.toggle("hidden", !isUserLoggedIn);
      this.querySelector("#user-greeting").classList.toggle(
        "hidden",
        !isUserLoggedIn,
      );
      this.querySelector("#user-greeting").innerHTML = isUserLoggedIn
        ? `Hi, ${this.user.name}`
        : "";
    }
  },
);

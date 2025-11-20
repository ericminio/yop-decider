customElements.define(
  "yop-menu",
  class extends YopElement {
    static template = "/templates/menu/index.html";

    async wire() {
      this.querySelector("#propose").addEventListener("click", () => {
        navigate.to("/new");
      });
      this.querySelector("#login").addEventListener("click", () => {
        navigate.to("/login?then=/");
      });
      this.querySelector("#logout").addEventListener("click", () => {
        this.store.delete("user");
        this.update();
        this.navigate.to("/");
      });
      this.update();
    }

    update() {
      const user = this.store.getObject("user");
      const isUserLoggedIn = user !== null;
      this.querySelector("#login").classList.toggle("hidden", isUserLoggedIn);
      this.querySelector("#logout").classList.toggle("hidden", !isUserLoggedIn);
      this.querySelector("#user-greeting").classList.toggle(
        "hidden",
        !isUserLoggedIn,
      );
      this.querySelector("#user-greeting").innerHTML = isUserLoggedIn
        ? `Hi, ${user.name}`
        : "";
    }
  },
);

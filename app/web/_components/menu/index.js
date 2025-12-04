customElements.define(
  "yop-menu",
  class extends MaybeUserElement {
    static template = "/templates/_components/menu/index.html";

    async render() {
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
      this.update();
    }

    update() {
      const isUserLoggedIn = !!this.user;
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

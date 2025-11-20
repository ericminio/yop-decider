customElements.define(
  "login-page",
  class extends YopElement {
    static template = "/templates/login/index.html";

    async wire() {
      this.registerListener(
        this.loginSuccessful.bind(this),
        "login.successful",
      );
      this.registerListener(this.loginFailed.bind(this), "login.failed");
      this.querySelector("#login").addEventListener("click", () => {
        this.requestLogin();
      });
      const searchParams = this.getAttribute("searchParams");
      const params = new URLSearchParams(searchParams);
      const then = params.get("then");
      this.then = then ? then : "/";
    }

    async requestLogin() {
      const name = this.querySelector("#name").value;
      const password = this.querySelector("#password").value;
      this.notify("login.requested", { name, password });
    }

    async loginSuccessful(user) {
      this.store.saveObject("user", user);
      navigate.to(this.then);
    }

    async loginFailed() {
      this.querySelector("#error").innerHTML = "Invalid credentials";
    }
  },
);

customElements.define(
  "login-page",
  class extends YopElement {
    async connectedCallback() {
      this.innerHTML = await fetch("/templates/login/index.html").then(
        (response) => response.text(),
      );
      this.registerListener(
        this.loginSuccessful.bind(this),
        "login.successful",
      );
      this.registerListener(this.loginFailed.bind(this), "login.failed");
      this.querySelector("#login").addEventListener("click", () => {
        this.requestLogin();
      });
    }

    async requestLogin() {
      const name = this.querySelector("#name").value;
      const password = this.querySelector("#password").value;
      this.notify("login.requested", { name, password });
    }

    async loginSuccessful(user) {
      store.saveObject("user", user);
      navigate.to("/new");
    }

    async loginFailed() {
      this.querySelector("#error").innerHTML = "Invalid credentials";
    }
  },
);

customElements.define(
  "new-proposal-page",
  class extends YopElement {
    static template = "/templates/new/index.html";

    async wire() {
      const storedUser = this.store.getObject("user");
      if (!storedUser) {
        navigate.to("/login");
        return;
      }
      this.user = new User(storedUser, this.bus);
      this.querySelector("#invite").textContent = `Hi, ${this.user.name}`;
      this.querySelector("#submit-proposal").addEventListener("click", () => {
        this.propose();
      });
    }

    propose() {
      this.registerListener(new EventPoster(), "proposition.created");
      this.user.proposes(this.querySelector("#new-proposal").value);
      navigate.to("/");
    }
  },
);

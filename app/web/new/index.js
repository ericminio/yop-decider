customElements.define(
  "new-proposal-page",
  class extends YopElement {
    static template = "/templates/new/index.html";

    async wire() {
      const storedUser = this.localStorage.getObject("user");
      if (!storedUser) {
        navigate.to("/login?then=/new");
        return;
      }
      this.user = this.store.getObject(new User(storedUser).id());
      this.querySelector("#invite").textContent = `Hi, ${this.user.name}`;
      this.querySelector("#submit-proposal").addEventListener("click", () => {
        this.propose();
      });
      this.querySelector("#continue").addEventListener("click", () => {
        navigate.to("/");
      });
    }

    propose() {
      this.registerListener(this.submitSuccess.bind(this), "event.saved");
      this.user.proposes(this.querySelector("#new-proposal").value);
    }

    submitSuccess() {
      this.querySelector("#success").textContent = "Proposal submitted";
      this.querySelector("#continue").classList.remove("hidden");
    }
  },
);

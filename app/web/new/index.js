customElements.define(
  "new-proposal-page",
  class extends MaybeUserElement {
    static template = "/templates/new/index.html";

    async wire() {
      const storedUser = this.localStorage.getObject("user");
      if (!storedUser) {
        navigate.to("/login?then=/new");
        return;
      }
      this.querySelector("#submit-proposal").addEventListener("click", () => {
        this.propose();
      });
      this.querySelector("#continue").addEventListener("click", () => {
        navigate.to("/");
      });
      this.update();

      this.registerListener(this.updatedUser.bind(this), "user.authorized");
      this.notify("user.challenged");
    }

    update() {
      if (!!this.user) {
        this.querySelector("#invite").textContent = `Hi, ${this.user.name}`;
      }
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

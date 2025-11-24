customElements.define(
  "yop-proposition-card",
  class extends YopElement {
    static template = "/templates/_components/propositionCard/index.html";

    async wire() {
      const id = this.getAttribute("id");

      const storedUser = this.localStorage.getObject("user");
      if (storedUser) {
        this.user = new User(storedUser, this.bus);
      }
      this.proposition = this.store.getObject(id);

      this.querySelector(".proposition-card-owner").textContent =
        this.proposition.owner.name;
      this.querySelector(".proposition-card-text").textContent =
        this.proposition.text;
      this.querySelector(".proposition-card-votes").classList.toggle(
        "hidden",
        !this.user,
      );
      this.querySelectorAll(".voting-button").forEach((button) => {
        button.addEventListener("click", () => {
          this.vote(button.getAttribute("name"));
        });
      });
      this.displayCurrentVote();
    }

    displayCurrentVote() {
      if (this.user) {
        const choice = this.user.choice(this.proposition);
        if (choice) {
          this.adjustVisuals(choice);
        }
      }
    }

    vote(choice) {
      this.adjustVisuals(choice);
      this.user.vote(choice, this.proposition);
    }

    adjustVisuals(choice) {
      this.querySelectorAll(".voting-button").forEach((button) => {
        button.classList.remove("voted");
      });

      this.querySelector(`.voting-button[name='${choice}']`).classList.add(
        "voted",
      );
    }
  },
);

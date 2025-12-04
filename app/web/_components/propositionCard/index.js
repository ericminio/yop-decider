customElements.define(
  "yop-proposition-card",
  class extends MaybeUserElement {
    static template = "/templates/_components/propositionCard/index.html";

    async wire() {
      this.proposition = this.store.getObject(this.getAttribute("id"));
      this.querySelector(".proposition-card-owner").textContent =
        this.proposition.owner.name;
      this.querySelector(".proposition-card-text").textContent =
        this.proposition.text;
      this.querySelectorAll(".voting-button").forEach((button) => {
        button.addEventListener("click", () => {
          this.vote(button.getAttribute("name"));
        });
      });
      this.update();

      this.registerListener(this, "event.saved");
      this.registerListener(this.updatedUser.bind(this), "user.authorized");
      this.notify("user.challenged");
    }

    update() {
      this.querySelector(".proposition-card-votes").classList.toggle(
        "hidden",
        !this.user,
      );
      if (this.user) {
        const choice = this.user.choice(this.proposition);
        if (choice) {
          this.displayVote(choice);
        }
      }
    }

    vote(choice) {
      this.user.vote(choice, this.proposition);
    }

    displayVote(choice) {
      this.querySelectorAll(".voting-button").forEach((button) => {
        button.classList.remove("voted");
      });
      this.querySelector(`.voting-button[name='${choice}']`).classList.add(
        "voted",
      );
    }
  },
);

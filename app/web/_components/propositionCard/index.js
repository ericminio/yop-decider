customElements.define(
  "yop-proposition-card",
  class extends MaybeUserElement {
    static template = "/templates/_components/propositionCard/index.html";

    async render() {
      this.proposition = this.store.getObject(this.getAttribute("id"));
      this.querySelector(".proposition-card-owner").textContent =
        this.proposition.owner.id;
      this.querySelector(".proposition-card-text").textContent =
        this.proposition.text;
      this.querySelectorAll(".voting-button").forEach((button) => {
        button.addEventListener("click", () => {
          this.vote(button.getAttribute("name"));
        });
      });

      this.update();
      this.registerListener(this, "event.saved");
    }

    update() {
      this.querySelectorAll(".voting-button").forEach((button) => {
        button.disabled = !this.user;
      });
      if (this.user) {
        const choice = this.user.choice(this.proposition);
        if (choice) {
          this.displayVote(choice);
        }
      }
      this.displayVoteCounts(this.proposition);
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

    displayVoteCounts(proposition) {
      this.querySelectorAll(".vote-count").forEach((label) => {
        label.textContent = proposition.counts[label.getAttribute("name")];
      });
    }
  },
);

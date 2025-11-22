customElements.define(
  "yop-proposition-card",
  class extends YopElement {
    static template = "/templates/_components/propositionCard/index.html";

    async wire() {
      this.owner = this.getAttribute("owner");
      this.text = this.getAttribute("text");

      const storedUser = this.localStorage.getObject("user");
      if (storedUser) {
        this.user = new User(storedUser, this.bus);
      }
      this.proposition = this.store.getObject(this.text);

      this.querySelector(".proposition-card-owner").textContent = this.owner;
      this.querySelector(".proposition-card-text").textContent = this.text;
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
        const choice = this.proposition.choice(this.user);
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

customElements.define(
  "yop-proposition-card",
  class extends YopElement {
    static template = "/templates/_components/propositionCard/index.html";

    async wire() {
      const id = this.getAttribute("id");

      const storedUser = this.localStorage.getObject("user");
      if (storedUser) {
        this.user = this.store.getObject(new User(storedUser).id());
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
      this.update();
      this.registerListener(this, "event.saved");

      this.querySelectorAll(".voting-button").forEach((button) => {
        button.addEventListener("click", () => {
          this.vote(button.getAttribute("name"));
        });
      });
    }

    update() {
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

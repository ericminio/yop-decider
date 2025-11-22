customElements.define(
  "yop-proposition-card",
  class extends YopElement {
    static template = "/templates/_components/propositionCard/index.html";

    async wire() {
      this.owner = this.getAttribute("owner");
      this.text = this.getAttribute("text");

      this.storedUser = this.localStorage.getObject("user");
      if (this.storedUser) {
        this.user = new User(this.storedUser, this.bus);
      }
      this.proposition = this.store.getObject(this.text);

      this.querySelector(".proposition-card-owner").textContent = this.owner;
      this.querySelector(".proposition-card-text").textContent = this.text;
      this.querySelector(".proposition-card-votes").classList.toggle(
        "hidden",
        !this.storedUser,
      );
      this.querySelector(".voting-button[name='yes']").addEventListener(
        "click",
        () => {
          this.vote("yes");
        },
      );
      this.querySelector(".voting-button[name='support']").addEventListener(
        "click",
        () => {
          this.vote("support");
        },
      );
      this.querySelector(".voting-button[name='no']").addEventListener(
        "click",
        () => {
          this.vote("no");
        },
      );
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
      this.querySelector(".voting-button[name='yes']").classList.remove(
        "voted",
      );
      this.querySelector(".voting-button[name='support']").classList.remove(
        "voted",
      );
      this.querySelector(".voting-button[name='no']").classList.remove("voted");

      this.querySelector(`.voting-button[name='${choice}']`).classList.add(
        "voted",
      );
    }
  },
);

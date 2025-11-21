customElements.define(
  "yop-proposition-card",
  class extends YopElement {
    static template = "/templates/_components/propositionCard/index.html";

    async wire() {
      const user = this.store.getObject("user");
      const isUserLoggedIn = user !== null;
      this.querySelector(".proposition-card-votes").classList.toggle(
        "hidden",
        !isUserLoggedIn,
      );

      this.ownerDiv = this.querySelector(".proposition-card-owner");
      this.textDiv = this.querySelector(".proposition-card-text");
      this.update();
      this.querySelector("#yes").addEventListener("click", async () => {
        this.vote("yes");
      });
    }

    update() {
      this.ownerDiv.textContent = this.getAttribute("owner");
      this.textDiv.textContent = this.getAttribute("text");
    }

    vote(choice) {
      this.querySelector(`#${choice}`).classList.add("voted");
    }
  },
);

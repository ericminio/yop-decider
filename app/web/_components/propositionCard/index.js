customElements.define(
  "yop-proposition-card",
  class extends YopElement {
    static template = "/templates/_components/propositionCard/index.html";

    async wire() {
      this.user = this.store.getObject("user");
      this.querySelector(".proposition-card-votes").classList.toggle(
        "hidden",
        !this.user,
      );

      this.owner = this.getAttribute("owner");
      this.text = this.getAttribute("text");
      this.querySelector(".proposition-card-owner").textContent = this.owner;
      this.querySelector(".proposition-card-text").textContent = this.text;
      this.querySelector("#yes").addEventListener("click", async () => {
        this.vote("yes");
      });
    }

    vote(choice) {
      this.querySelector(`#${choice}`).classList.add("voted");
    }
  },
);

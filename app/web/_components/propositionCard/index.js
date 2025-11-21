customElements.define(
  "yop-proposition-card",
  class extends YopElement {
    static template = "/templates/_components/propositionCard/index.html";

    async wire() {
      this.ownerDiv = this.querySelector(".proposition-card-owner");
      this.textDiv = this.querySelector(".proposition-card-text");
      this.update();
    }

    update() {
      this.ownerDiv.textContent = this.getAttribute("owner");
      this.textDiv.textContent = this.getAttribute("text");
    }
  },
);

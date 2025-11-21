customElements.define(
  "yop-propositions",
  class extends YopElement {
    static template = "/templates/propositions/index.html";

    async wire() {
      this.list = this.querySelector("#propositions-list");

      this.registerListener(this.display.bind(this), "proposition.created");
      this.notify("propositions.requested");
    }

    async display({ owner, text }) {
      this.list.innerHTML =
        `<yop-proposition-card owner="${owner}" text="${text}"></yop-proposition-card>` +
        this.list.innerHTML;
    }
  },
);

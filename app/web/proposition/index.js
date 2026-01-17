customElements.define(
  "proposition-page",
  class extends MaybeUserElement {
    static template = "/templates/proposition/index.html";

    async render() {
      this.proposition = this.store.getObject(this.getAttribute("id"));
      this.querySelector("#proposition").innerHTML = `
        <yop-proposition-card id="${this.proposition.id()}"></yop-proposition-card>
      `;
      this.update();
    }

    update() {}
  },
);

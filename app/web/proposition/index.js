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

    update() {
      this.querySelector("#proposition-challengers-list").innerHTML =
        Object.entries(this.proposition.voters)
          .filter(([_, choice]) => choice === "no")
          .map(([id, _]) => id)
          .join(", ");
      this.querySelector("#proposition-supporting-list").innerHTML =
        Object.entries(this.proposition.voters)
          .filter(([_, choice]) => choice === "support")
          .map(([id, _]) => id)
          .join(", ");
      this.querySelector("#proposition-committed-list").innerHTML =
        Object.entries(this.proposition.voters)
          .filter(([_, choice]) => choice === "yes")
          .map(([id, _]) => id)
          .join(", ");
    }
  },
);

customElements.define(
  "proposition-page",
  class extends MaybeUserElement {
    static template = "/templates/proposition/index.html";

    async render() {
      this.registerListener(this, "events.fetched");
      this.registerListener(this.reload.bind(this), "event.saved");
      this.reload();
    }

    reload() {
      this.notify("events.requested");
    }

    update() {
      this.proposition = this.store.getObject(this.getAttribute("data-id"));
      this.querySelector("#proposition").innerHTML = `
        <yop-proposition-card data-id="${this.proposition.id()}"></yop-proposition-card>
      `;

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

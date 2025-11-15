customElements.define(
  "yop-propositions",
  class extends HTMLElement {
    constructor() {
      super();
    }

    async connectedCallback() {
      this.innerHTML = await fetch("/templates/propositions/index.html").then(
        (response) => response.text(),
      );
      this.list = this.querySelector("#propositions-list");

      eventBus.register(this.display.bind(this), "proposition.created");
      eventBus.notify("propositions.requested");
    }

    async display({ owner, text }) {
      this.list.innerHTML = `<li>${owner}: ${text}</li>` + this.list.innerHTML;
    }
  },
);

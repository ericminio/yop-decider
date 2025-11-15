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
      eventBus.register(this.display.bind(this), "events.fetched");
      eventBus.notify("events.requested");
    }

    async display({ propositions }) {
      const html = propositions.map(
        ({ text, owner }) => `<li>${owner}: ${text}</li>`,
      );
      this.querySelector("#propositions-list").innerHTML = html.join("");
    }
  },
);

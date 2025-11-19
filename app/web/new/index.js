customElements.define(
  "new-proposal-page",
  class extends HTMLElement {
    constructor() {
      super();
    }

    async connectedCallback() {
      this.innerHTML = await fetch("/templates/new/index.html").then(
        (response) => response.text(),
      );
    }
  },
);

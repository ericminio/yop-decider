customElements.define(
  "home-page",
  class extends HTMLElement {
    constructor() {
      super();
    }

    async connectedCallback() {
      this.innerHTML = await fetch("/templates/home/index.html").then(
        (response) => response.text(),
      );
    }
  },
);

customElements.define(
  "yop-menu",
  class extends HTMLElement {
    constructor() {
      super();
    }

    async connectedCallback() {
      this.innerHTML = await fetch("/templates/menu/index.html").then(
        (response) => response.text(),
      );
    }
  },
);

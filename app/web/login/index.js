customElements.define(
  "login-page",
  class extends HTMLElement {
    constructor() {
      super();
    }

    async connectedCallback() {
      this.innerHTML = await fetch("/templates/login/index.html").then(
        (response) => response.text(),
      );
    }
  },
);

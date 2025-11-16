customElements.define(
  "yop-propositions",
  class extends YopElement {
    async connectedCallback() {
      this.innerHTML = await fetch("/templates/propositions/index.html").then(
        (response) => response.text(),
      );
      this.list = this.querySelector("#propositions-list");

      this.registerListener(this.display.bind(this), "proposition.created");
      this.notify("propositions.requested");
    }

    async display({ owner, text }) {
      this.list.innerHTML = `<li>${owner}: ${text}</li>` + this.list.innerHTML;
    }
  },
);

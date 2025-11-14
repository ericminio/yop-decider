customElements.define(
  "yop-route",
  class extends HTMLElement {
    connectedCallback() {
      if (this.getAttribute("then") !== null) {
        let then = this.getAttribute("then");
        this.then = `<${then}></${then}>`;
      } else {
        this.then = this.innerHTML;
      }
      eventBus.register(this, "navigation");
      this.update();
    }
    update() {
      if (window.location.pathname == this.getAttribute("when")) {
        this.innerHTML = this.then;
      } else {
        this.innerHTML = "";
      }
    }
  },
);

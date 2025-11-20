customElements.define(
  "yop-route",
  class extends HTMLElement {
    connectedCallback() {
      if (this.getAttribute("then") !== null) {
        this.thenAttributeSet = true;
        this.thenAttribute = this.getAttribute("then");
        this.then = `<${this.thenAttribute}></${this.thenAttribute}>`;
      } else {
        this.thenAttributeSet = false;
        this.then = this.innerHTML;
      }
      eventBus.register(this, "navigation");
      this.update();
    }
    update() {
      if (window.location.pathname == this.getAttribute("when")) {
        const searchParams = window.location.search;
        if (this.thenAttributeSet && searchParams) {
          this.then = `<${this.thenAttribute} searchParams="${searchParams}"></${this.thenAttribute}>`;
        }
        this.innerHTML = this.then;
      } else {
        this.innerHTML = "";
      }
    }
  },
);

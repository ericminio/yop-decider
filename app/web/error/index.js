customElements.define(
  "yop-error",
  class extends YopElement {
    static template = "/templates/error/index.html";

    async wire() {
      this.registerListener(this, "error.occurred");
    }

    update(value) {
      this.querySelector("#error-message").textContent = value;
      this.querySelector("#error-toast").classList.remove("hidden");
    }
  },
);

customElements.define(
  "yop-error",
  class extends YopElement {
    static template = "/templates/error/index.html";

    async wire() {
      this.registerListener(this, "error.occurred");
      this.querySelector("#error-toast").addEventListener("click", () => {
        this.querySelector("#error-message").textContent = "";
        this.querySelector("#error-toast").classList.add("hidden");
      });
    }

    update(value) {
      this.querySelector("#error-message").textContent = value;
      this.querySelector("#error-toast").classList.remove("hidden");
    }
  },
);

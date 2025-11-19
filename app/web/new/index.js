customElements.define(
  "new-proposal-page",
  class extends YopElement {
    async connectedCallback() {
      this.innerHTML = await fetch("/templates/new/index.html").then(
        (response) => response.text(),
      );
      this.user = new User(store.getObject("user"), this.bus);
      this.querySelector("#invite").textContent = `Hi, ${this.user.name}`;
      this.registerListener(new EventPoster(), "proposition.created");
      this.querySelector("#submit-proposal").addEventListener("click", () => {
        this.propose();
      });
    }

    propose() {
      this.user.proposes(this.querySelector("#new-proposal").value);
      navigate.to("/");
    }
  },
);

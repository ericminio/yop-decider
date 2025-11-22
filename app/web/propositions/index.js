customElements.define(
  "yop-propositions",
  class extends YopElement {
    static template = "/templates/propositions/index.html";

    async wire() {
      this.user = this.localStorage.getObject("user");
      this.querySelector("#login-invite").classList.toggle(
        "hidden",
        this.user !== null,
      );

      this.list = this.querySelector("#propositions-list");
      this.registerListener(this, "events.fetched");
      this.notify("propositions.requested");
    }

    update({ propositions }) {
      this.list.innerHTML = "";
      for (const proposition of propositions) {
        this.display({
          owner: proposition.owner.name,
          text: proposition.text,
        });
      }
    }

    display({ owner, text }) {
      this.list.innerHTML =
        `<yop-proposition-card owner="${owner}" text="${text}"></yop-proposition-card>` +
        this.list.innerHTML;
    }
  },
);

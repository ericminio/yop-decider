customElements.define(
  "yop-propositions",
  class extends YopElement {
    static template = "/templates/_components/propositions/index.html";

    async wire() {
      this.user = this.localStorage.getObject("user");
      this.querySelector("#login-invite").classList.toggle(
        "hidden",
        this.user !== null,
      );

      this.list = this.querySelector("#propositions-list");
      this.list.innerHTML = "<yop-spinner></yop-spinner>";
      this.registerListener(this, "events.fetched");
      this.notify("propositions.requested");
    }

    update({ propositions }) {
      this.querySelector("#login-invite").classList.toggle(
        "hidden",
        this.user !== null || propositions.length === 0,
      );
      if (propositions.length === 0) {
        this.list.innerHTML = "Nothing here yet...";
        return;
      }

      this.list.innerHTML = "";
      for (const proposition of propositions) {
        this.display({
          id: proposition.id(),
        });
      }
    }

    display({ id }) {
      const card = document.createElement("yop-proposition-card");
      card.setAttribute("id", id);
      this.list.prepend(card);
    }
  },
);

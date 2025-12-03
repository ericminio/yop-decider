customElements.define(
  "yop-propositions",
  class extends MaybeUserElement {
    static template = "/templates/_components/propositions/index.html";

    async wire() {
      this.list = this.querySelector("#propositions-list");
      this.list.innerHTML = "<yop-spinner></yop-spinner>";
      this.registerListener(
        this.updatedPropositions.bind(this),
        "events.fetched",
      );
      this.registerListener(this.updatedUser.bind(this), "user.authorized");
      this.getUser();
      this.updatedPropositions({ propositions: [] });
      this.notify("propositions.requested");
    }

    updatedUser() {
      this.getUser();
      this.update();
    }
    updatedPropositions({ propositions }) {
      this.propositions = propositions;
      this.update();
    }

    update() {
      this.querySelector("#login-invite").classList.toggle(
        "hidden",
        !!this.user || this.propositions.length === 0,
      );
      if (this.propositions.length === 0) {
        this.list.innerHTML = "Nothing here yet...";
        return;
      }

      this.list.innerHTML = "";
      for (const proposition of this.propositions) {
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

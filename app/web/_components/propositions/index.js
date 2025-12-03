customElements.define(
  "yop-propositions",
  class extends YopElement {
    static template = "/templates/_components/propositions/index.html";

    async wire() {
      this.list = this.querySelector("#propositions-list");
      this.list.innerHTML = "<yop-spinner></yop-spinner>";
      this.registerListener(this, "events.fetched");
      this.registerListener(this, "user.authorized");
      this.notify("propositions.requested");
      this.update({ propositions: [] });
    }

    getUser() {
      const storedUser = this.localStorage.getObject("user");
      if (!!storedUser) {
        this.user = this.store.getObject(new User(storedUser).id());
        if (!this.user) {
          this.notify("user.challenged");
        }
      } else {
        this.user = null;
      }
    }

    update({ propositions }) {
      this.getUser();
      this.querySelector("#login-invite").classList.toggle(
        "hidden",
        !!this.user || propositions.length === 0,
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

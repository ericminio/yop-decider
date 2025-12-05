export class User {
  constructor({ id, password }, options = {}) {
    this.id = id;
    this.password = password;
    this.votes = {};
    this.bus = options.bus;
    this.bus && this.bus.notify("user.created", { id, password });
  }
  equals(other) {
    return other && this.id === other.id;
  }
  proposes(text) {
    const proposition = new Proposition(
      { owner: this, text },
      { bus: this.bus },
    );
    this.vote("yes", proposition);
  }
  vote(choice, proposition) {
    if (this.choice(proposition) === choice) {
      return;
    }
    this.votes[proposition.id()] = choice;
    this.bus &&
      this.bus.notify("user.voted", {
        proposition: proposition.text,
        owner: proposition.owner.id,
        voter: this.id,
        choice,
      });
  }
  choice(proposition) {
    return this.votes[proposition.id()] || null;
  }
}

export class Proposition {
  constructor({ owner, text }, options = {}) {
    this.owner = owner;
    this.text = text;
    this.bus = options.bus;
    this.bus &&
      this.bus.notify("proposition.created", { owner: owner.id, text });
  }
  id() {
    return `${this.text.replace(/\s+/g, "-").toLowerCase()}`;
  }
}

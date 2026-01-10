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
    return proposition;
  }
  vote(choice, proposition) {
    if (this.choice(proposition) === choice) {
      return;
    }
    if (!!this.choice(proposition)) {
      proposition.counts[this.choice(proposition)] -= 1;
    }
    this.votes[proposition.id()] = choice;
    proposition.counts[choice] += 1;
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
    this.counts = { yes: 0, no: 0, support: 0 };
    this.bus = options.bus;
    this.bus &&
      this.bus.notify("proposition.created", { owner: owner.id, text });
  }
  id() {
    return `${this.text.replace(/\s+/g, "-").toLowerCase()}`;
  }
}

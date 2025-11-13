import { Proposition, User } from "../domain/domain.js";

export class InFileEvents {
  constructor(bus) {
    this.events = [];
    this.bus = bus;
    this.bus && this.bus.registerForAll(this);
  }
  update(value, key) {
    this.events.push({ event: key, source: value });
  }

  userJson(user) {
    return JSON.stringify({
      name: user.name,
    });
  }

  usersAsJson() {
    const users = this.events
      .filter(({ event }) => event === "user.created")
      .map(({ source }) => this.userJson(source));
    return `[${users.join(",")}]`;
  }

  loadUsers(incoming) {
    const parsed = JSON.parse(incoming);
    return parsed.map((userData) => new User(userData, this.bus));
  }

  propositionJson(proposition) {
    return JSON.stringify({
      owner: this.userJson(proposition.owner),
      text: proposition.text,
    });
  }

  propositionsAsJson() {
    const propositions = this.events
      .filter(({ event }) => event === "proposition.created")
      .map(({ source }) => this.propositionJson(source));
    return `[${propositions.join(",")}]`;
  }

  loadPropositions(incoming) {
    const parsed = JSON.parse(incoming);
    return parsed.map(
      (propData) =>
        new Proposition(
          {
            owner: new User(JSON.parse(propData.owner), this.bus),
            text: propData.text,
          },
          this.bus,
        ),
    );
  }
}

export class User {
  constructor({ name, password }, bus) {
    this.name = name;
    this.password = password;
    this.bus = bus;
    this.bus && this.bus.notify("user.created", { name, password });
  }
  proposes(text) {
    return new Proposition({ owner: this, text }, this.bus);
  }
  vote(choice, proposition) {
    proposition.vote(this, choice);
  }
}

export class Proposition {
  constructor({ owner, text }, bus) {
    this.owner = owner;
    this.text = text;
    this.votes = [];
    this.bus = bus;
    this.bus &&
      this.bus.notify("proposition.created", { owner: owner.name, text });
  }
  vote(user, choice) {
    this.removeExistingVote(user);
    this.votes.push({ user, choice });
    this.bus &&
      this.bus.notify("user.voted", {
        proposition: this.text,
        owner: this.owner.name,
        voter: user.name,
        choice,
      });
  }
  choice(user) {
    const vote = this.votes.find((vote) => vote.user.name === user.name);
    return vote ? vote.choice : null;
  }
  removeExistingVote(user) {
    const existingVoteIndex = this.votes.findIndex(
      (vote) => vote.user === user,
    );
    if (existingVoteIndex !== -1) {
      this.votes.splice(existingVoteIndex, 1);
    }
  }
}

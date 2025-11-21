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
    this.participants = [];
    this.votes = [];
    this.yesVotesCount = 0;
    this.challengers = [];
    this.bus = bus;
    this.bus &&
      this.bus.notify("proposition.created", { owner: owner.name, text });
  }
  isMadeTo(users) {
    this.participants = users;
  }
  acceptedBy(user) {
    this.vote(user, "yes");
  }
  rejectedBy(user) {
    this.vote(user, "no");
  }
  supportedBy(user) {
    this.vote(user, "support");
  }
  updateYesCount() {
    this.yesVotesCount = this.votes.filter(
      (vote) => vote.vote === "yes",
    ).length;
  }
  updateChallengers() {
    this.challengers = this.votes
      .filter(({ vote }) => vote === "no")
      .map(({ user }) => user);
  }
  accepted() {
    if (this.votes.length < this.participants.length) {
      return "pending";
    }
    return this.yesVotesCount / this.participants.length;
  }

  vote(user, value) {
    this.removeExistingVote(user);
    this.votes.push({ user, vote: value });
    this.updateYesCount();
    this.updateChallengers();
    this.bus &&
      this.bus.notify("user.voted", {
        proposition: this.text,
        owner: this.owner.name,
        voter: user.name,
        vote: value,
      });
  }
  choice(user) {
    const userVote = this.votes.find((vote) => vote.user.name === user.name);
    return userVote ? userVote.vote : null;
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

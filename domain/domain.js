export class User {
  constructor({ name }, bus) {
    this.name = name;
    this.bus = bus;
    this.bus && this.bus.notify("user.created", this);
  }
  proposes(text) {
    return new Proposition({ owner: this, text }, this.bus);
  }
  summary() {
    return this.name;
  }
  voteYes(proposition) {
    proposition.acceptedBy(this);
  }
  voteNo(proposition) {
    proposition.rejectedBy(this);
  }
  supports(proposition) {
    proposition.supportedBy(this);
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
    this.bus && this.bus.notify("proposition.created", this);
  }
  summary() {
    return `${this.owner.summary()}: ${this.text}`;
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
      this.bus.notify(
        "user.voted",
        new Vote({
          proposition: this,
          user: user,
          value,
        }),
      );
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

class Vote {
  constructor({ proposition, user, value }) {
    this.proposition = proposition;
    this.user = user;
    this.value = value;
  }
  summary() {
    return `${this.proposition.summary()} -> ${this.user.summary()}: ${this.value}`;
  }
}

export class User {
  constructor({ name }) {
    this.name = name;
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
  constructor({ owner, text }) {
    this.owner = owner;
    this.text = text;
    this.participants = [];
    this.votes = [];
    this.yesVotesCount = 0;
    this.challengers = [];
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

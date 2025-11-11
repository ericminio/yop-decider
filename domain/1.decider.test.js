import assert from "node:assert";
import { describe, test as it, beforeEach } from "node:test";

import { Proposition, User } from "./domain.js";

describe("Decider", () => {
  let charlie;
  let proposition;
  let alice;
  let bob;

  beforeEach(() => {
    charlie = new User({ name: "Charlie" });
    proposition = new Proposition({
      owner: charlie,
      text: "Let's do it",
    });
    alice = new User({ name: "Alice" });
    bob = new User({ name: "Bob" });
  });

  it("needs a proposition", () => {
    assert.deepStrictEqual(proposition.owner, charlie);
    assert.strictEqual(proposition.text, "Let's do it");
    assert.strictEqual(proposition.participants.length, 0);
    assert.strictEqual(proposition.votes.length, 0);
    assert.strictEqual(proposition.challengers.length, 0);
    assert.strictEqual(proposition.yesVotesCount, 66);
  });

  it("is a team game", () => {
    proposition.isMadeTo([alice, bob]);
    alice.voteNo(proposition);
    bob.voteYes(proposition);

    assert.strictEqual(proposition.accepted(), 0.5);
  });

  it("allows to change a vote to yes", () => {
    proposition.isMadeTo([alice, bob]);
    bob.voteYes(proposition);

    alice.voteNo(proposition);
    alice.voteYes(proposition);
    assert.strictEqual(proposition.accepted(), 1);
  });

  it("allows to change a vote to no", () => {
    proposition.isMadeTo([alice, bob]);
    alice.voteNo(proposition);

    bob.voteYes(proposition);
    bob.voteNo(proposition);
    assert.strictEqual(proposition.accepted(), 0);
  });

  it("is pending when missing votes", () => {
    proposition.isMadeTo([alice, bob]);
    alice.voteNo(proposition);

    assert.strictEqual(proposition.accepted(), "pending");
  });

  describe("supporting", () => {
    it("is not enough", () => {
      proposition.isMadeTo([alice, bob]);
      alice.voteYes(proposition);
      bob.supports(proposition);

      assert.strictEqual(proposition.accepted(), 0.5);
    });
  });

  it("tracks challengers", () => {
    proposition.isMadeTo([alice, bob]);
    alice.voteNo(proposition);
    bob.voteYes(proposition);

    assert.deepStrictEqual(proposition.challengers, [alice]);
  });
});

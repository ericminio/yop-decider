import assert from "node:assert";
import { describe, test as it, beforeEach } from "node:test";

import { User } from "../domain.js";

describe("Decider", () => {
  let charlie;
  let proposition;
  let alice;
  let bob;

  beforeEach(() => {
    charlie = new User({ name: "Charlie" });
    proposition = charlie.proposes("Let's do it");
    alice = new User({ name: "Alice" });
    bob = new User({ name: "Bob" });
  });

  it("needs a proposition", () => {
    assert.deepStrictEqual(proposition.owner, charlie);
    assert.strictEqual(proposition.text, "Let's do it");
  });

  it("makes the owner of a proposition to automatically vote yes", () => {
    assert.deepStrictEqual(charlie.choice(proposition), "yes");
  });

  it("offers to vote", () => {
    bob.vote("yes", proposition);

    assert.deepStrictEqual(bob.choice(proposition), "yes");
  });

  it("allows to change a vote", () => {
    alice.vote("no", proposition);
    alice.vote("yes", proposition);

    assert.deepStrictEqual(alice.choice(proposition), "yes");
  });

  it("records the votes in the proposition", () => {
    bob.vote("yes", proposition);
    alice.vote("no", proposition);

    assert.deepStrictEqual(
      proposition.votes.map(({ user, choice }) => ({
        name: user.name,
        choice,
      })),
      [
        { name: "Charlie", choice: "yes" },
        { name: "Bob", choice: "yes" },
        { name: "Alice", choice: "no" },
      ],
    );
  });
});

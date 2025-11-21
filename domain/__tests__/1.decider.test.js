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
    assert.strictEqual(proposition.votes.length, 0);
  });

  it("offers the vote", () => {
    bob.vote("yes", proposition);
    alice.vote("no", proposition);

    assert.deepStrictEqual(
      proposition.votes.map(({ user, vote }) => ({ name: user.name, vote })),
      [
        { name: "Bob", vote: "yes" },
        { name: "Alice", vote: "no" },
      ],
    );
  });

  it("allows to change a vote", () => {
    alice.vote("no", proposition);
    alice.vote("yes", proposition);

    assert.deepStrictEqual(
      proposition.votes.map(({ user, vote }) => ({ name: user.name, vote })),
      [{ name: "Alice", vote: "yes" }],
    );
  });
});

import assert from "node:assert";
import { describe, test as it, beforeEach } from "node:test";

import { User } from "../domain.js";
import { EventBus } from "../../yop/dist/spa/event-bus.js";

describe("Decider", () => {
  let charlie;
  let proposition;
  let alice;
  let bob;
  let bus;

  beforeEach(() => {
    bus = new EventBus();
    charlie = new User({ id: "Charlie" }, { bus });
    proposition = charlie.proposes("Let's do it");
    alice = new User({ id: "Alice" }, { bus });
    bob = new User({ id: "Bob" }, { bus });
  });

  it("needs a proposition", () => {
    assert.deepStrictEqual(proposition.owner.id, charlie.id);
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

  it("keeps counts of votes in proposition", () => {
    alice.vote("yes", proposition);
    alice.vote("no", proposition);
    bob.vote("no", proposition);

    assert.deepStrictEqual(proposition.counts, { yes: 1, no: 2, support: 0 });
  });
});

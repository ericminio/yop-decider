import assert from "node:assert";
import { describe, test as it, beforeEach } from "node:test";

import { Proposition, User } from "../domain.js";
import { EventBus } from "../../yop/dist/spa/event-bus.js";

describe("Decider", () => {
  let charlie;
  let proposition;
  let alice;
  let bob;
  let bus;

  beforeEach(() => {
    bus = new EventBus();
    bus.register(({ owner, text }) => {
      proposition = new Proposition({ owner: new User({ name: owner }), text });
    }, "proposition.created");
    
    charlie = new User({ name: "Charlie" }, { bus });
    charlie.proposes("Let's do it");
    alice = new User({ name: "Alice" });
    bob = new User({ name: "Bob" });
  });

  it("needs a proposition", () => {
    assert.deepStrictEqual(proposition.owner.name, charlie.name);
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
});

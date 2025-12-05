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
  let propositions;

  beforeEach(() => {
    propositions = [];
    bus = new EventBus();
    bus.register(({ owner, text }) => {
      const p = new Proposition({ owner: new User({ id: owner }), text });
      propositions.push(p);
      proposition = p;
    }, "proposition.created");

    charlie = new User({ id: "Charlie" }, { bus });
    charlie.proposes("Let's do it");
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

  it("welcomes several propositions", () => {
    alice.proposes("I propose we test it");

    assert.deepStrictEqual(
      propositions.map((p) => ({ owner: p.owner.id, text: p.text })),
      [
        { owner: "Charlie", text: "Let's do it" },
        { owner: "Alice", text: "I propose we test it" },
      ],
    );
  });
});

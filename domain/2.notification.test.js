import assert from "node:assert";
import { describe, test as it, beforeEach } from "node:test";

import { Proposition, User } from "./domain.js";
import { EventBus } from "./event-bus.js";

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

  it("notifies", () => {
    class Store {
      constructor(bus) {
        this.events = [];
        bus.registerForAll(this);
      }
      update(value, key) {
        this.events.push({ event: key, data: value });
      }
    }
    const bus = new EventBus();
    const store = new Store(bus);
    charlie = new User({ name: "Charlie" }, bus);
    alice = new User({ name: "Alice" }, bus);
    proposition = new Proposition(
      {
        owner: charlie,
        text: "I propose we start today",
      },
      bus,
    );
    alice.voteNo(proposition);

    assert.deepStrictEqual(store.events, [
      { event: "user.created", data: { name: "Charlie" } },
      { event: "user.created", data: { name: "Alice" } },
      {
        event: "proposition.created",
        data: { owner: "Charlie", text: "I propose we start today" },
      },
      {
        event: "user.voted",
        data: {
          proposition: "I propose we start today",
          owner: "Charlie",
          voter: "Alice",
          vote: "no",
        },
      },
    ]);
  });
});

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
        this.events.push({ event: key, source: value });
      }
      log() {
        return this.events.map(({ event, source }) => ({
          event,
          summary: source.summary(),
        }));
      }
    }
    const bus = new EventBus();
    const store = new Store(bus);
    charlie = new User({ name: "Charlie" }, bus);
    proposition = new Proposition(
      {
        owner: charlie,
        text: "I propose we start today",
      },
      bus,
    );
    alice = new User({ name: "Alice" }, bus);
    bob = new User({ name: "Bob" }, bus);
    alice.voteNo(proposition);
    bob.voteYes(proposition);

    assert.deepStrictEqual(store.log(), [
      { event: "user.created", summary: "Charlie" },
      {
        event: "proposition.created",
        summary: "Charlie: I propose we start today",
      },
      { event: "user.created", summary: "Alice" },
      { event: "user.created", summary: "Bob" },
      {
        event: "user.voted",
        summary: "Charlie: I propose we start today -> Alice: no",
      },
      {
        event: "user.voted",
        summary: "Charlie: I propose we start today -> Bob: yes",
      },
    ]);
  });
});

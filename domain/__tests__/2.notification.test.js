import assert from "node:assert";
import { describe, test as it } from "node:test";

import { EventBus } from "../../yop//dist/spa/event-bus.js";
import { Proposition, User } from "../domain.js";

describe("Decider", () => {
  let charlie;
  let proposition;
  let alice;

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
    bus.register(({ owner, text }) => {
      proposition = new Proposition({ owner: new User({ name: owner }), text });
    }, "proposition.created");
    const store = new Store(bus);
    charlie = new User({ name: "Charlie", password: "encrypted" }, { bus });
    alice = new User({ name: "Alice", password: "encrypted" }, { bus });
    charlie.proposes("I propose we start today");
    alice.vote("no", proposition);

    assert.deepStrictEqual(store.events, [
      {
        event: "user.created",
        data: { name: "Charlie", password: "encrypted" },
      },
      { event: "user.created", data: { name: "Alice", password: "encrypted" } },
      {
        event: "proposition.created",
        data: { owner: "Charlie", text: "I propose we start today" },
      },
      {
        event: "user.voted",
        data: {
          proposition: "I propose we start today",
          owner: "Charlie",
          voter: "Charlie",
          choice: "yes",
        },
      },
      {
        event: "user.voted",
        data: {
          proposition: "I propose we start today",
          owner: "Charlie",
          voter: "Alice",
          choice: "no",
        },
      },
    ]);
  });

  it("does not notify twice for the same vote in a row", () => {
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
    charlie = new User({ name: "Charlie", password: "encrypted" }, { bus });
    alice = new User({ name: "Alice", password: "encrypted" }, { bus });
    const proposition = new Proposition(
      { owner: charlie, text: "I propose we start today" },
      { bus },
    );
    alice.vote("no", proposition);
    alice.vote("no", proposition);

    assert.equal(
      store.events.filter(({ event }) => event === "user.voted").length,
      1,
    );
  });
});

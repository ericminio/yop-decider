import assert from "node:assert";
import { describe, test as it, beforeEach } from "node:test";

import { EventBus } from "../../yop/index.js";
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
    const store = new Store(bus);
    charlie = new User({ name: "Charlie", password: "encrypted" }, bus);
    alice = new User({ name: "Alice", password: "encrypted" }, bus);
    const proposition = charlie.proposes("I propose we start today");
    alice.voteNo(proposition);

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
          voter: "Alice",
          vote: "no",
        },
      },
    ]);
  });
});

import assert from "node:assert";
import { describe, test as it, beforeEach } from "node:test";

import { Proposition, User } from "../domain/domain.js";
import { EventBus } from "../domain/event-bus.js";
import { InMemoryEvents } from "../store/inMemoryEvents.js";

describe("Store", () => {
  let bus;
  let store;

  beforeEach(() => {
    bus = new EventBus();
    store = new InMemoryEvents(bus);
  });

  it("knows the propositions", async () => {
    const charlie = new User({ name: "Charlie" }, bus);
    new Proposition(
      {
        owner: charlie,
        text: "Go!",
      },
      bus,
    );
    new Proposition(
      {
        owner: charlie,
        text: "Yes!",
      },
      bus,
    );
    const propositions = await store.getAllPropositions();

    assert.deepStrictEqual(
      propositions.map(({ text }) => text),
      ["Go!", "Yes!"],
    );
  });

  it("knows the users", async () => {
    new User({ name: "Charlie" }, bus);
    new User({ name: "Alice" }, bus);
    new User({ name: "Bob" }, bus);
    const users = await store.getAllUsers();

    assert.deepStrictEqual(
      users.map(({ name }) => name),
      ["Charlie", "Alice", "Bob"],
    );
  });
});

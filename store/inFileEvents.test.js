import assert from "node:assert";
import { describe, test as it, beforeEach } from "node:test";

import { Proposition, User } from "../domain/domain.js";
import { EventBus } from "../domain/event-bus.js";
import { InFileEvents } from "./inFileEvents.js";

describe("InFileEvents Store", () => {
  let bus;
  beforeEach(() => {
    bus = new EventBus();
  });
  it("needs json version of user", () => {
    const charlie = new User({ name: "Charlie" }, bus);
    assert.strictEqual(
      new InFileEvents().userJson(charlie),
      JSON.stringify({
        name: "Charlie",
      }),
    );
  });
  it("needs json version of proposition", () => {
    const charlie = new User({ name: "Charlie" }, bus);
    const proposition = new Proposition(
      {
        owner: charlie,
        text: "Go!",
      },
      bus,
    );

    assert.strictEqual(
      new InFileEvents().propositionJson(proposition),
      JSON.stringify({
        owner: JSON.stringify({ name: "Charlie" }),
        text: "Go!",
      }),
    );
  });

  it("stores user as json", () => {
    const store = new InFileEvents(bus);
    new User({ name: "Charlie" }, bus);
    const users = store.usersAsJson();

    assert.strictEqual(users, `[${JSON.stringify({ name: "Charlie" })}]`);
  });

  it("sets the bus when loading users", () => {
    const store = new InFileEvents(bus);
    const incoming = `[${JSON.stringify({ name: "Charlie" })}]`;
    const users = store.loadUsers(incoming);

    assert.deepStrictEqual(
      users.map(({ name }) => name),
      ["Charlie"],
    );
    assert.strictEqual(users[0].bus, bus);
  });

  it("stores proposition as json", () => {
    const store = new InFileEvents(bus);
    const charlie = new User({ name: "Charlie" }, bus);
    new Proposition(
      {
        owner: charlie,
        text: "Go!",
      },
      bus,
    );
    const propositions = store.propositionsAsJson();

    assert.strictEqual(
      propositions,
      `[${JSON.stringify({
        owner: JSON.stringify({ name: "Charlie" }),
        text: "Go!",
      })}]`,
    );
  });

  it("sets the bus when loading propositions", () => {
    const store = new InFileEvents(bus);
    const charlie = new User({ name: "Charlie" }, bus);
    const incoming = `[${JSON.stringify({
      owner: JSON.stringify({ name: "Charlie" }),
      text: "Go!",
    })}]`;

    const propositions = store.loadPropositions(incoming);

    assert.deepStrictEqual(
      propositions.map(({ text }) => text),
      ["Go!"],
    );
    assert.deepStrictEqual(
      propositions.map(({ owner }) => owner.name),
      ["Charlie"],
    );
    assert.strictEqual(propositions[0].bus, bus);
  });
});

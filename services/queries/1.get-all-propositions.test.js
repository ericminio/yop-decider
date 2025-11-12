import assert from "node:assert";
import { describe, test as it } from "node:test";

import { Proposition, User } from "../../domain/domain.js";
import { getAllPropositions } from "./getAllPropositions.js";
import { EventBus } from "../../domain/event-bus.js";

describe("Get all propositions", () => {
  it("needs a store", async () => {
    const bus = new EventBus();
    const store = new Store(bus);
    const charlie = new User({ name: "Charlie" });
    new Proposition(
      {
        owner: charlie,
        text: "Let's do it",
      },
      bus,
    );

    const propositions = await getAllPropositions({ store });
    assert.strictEqual(propositions.length, 1);
    assert.deepStrictEqual(propositions[0].text, "Let's do it");
  });
});

class Store {
  constructor(bus) {
    this.bus = bus;
    this.bus.register(
      this.propositionCreated.bind(this),
      "proposition.created",
    );
    this.propositions = [];
  }
  propositionCreated(proposition) {
    this.propositions.push(proposition);
  }
}

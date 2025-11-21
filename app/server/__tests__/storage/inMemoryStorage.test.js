import { describe, test } from "node:test";
import { strict as assert } from "node:assert";

import { EventBus } from "../../../../yop/dist/spa/event-bus.js";
import { InMemoryStorage } from "../../storage.js";

describe("inMemory storage", () => {
  test("saves key and value together", () => {
    const bus = new EventBus();
    const store = new InMemoryStorage(bus);
    bus.notify("anything", { answer: 42 });
    bus.notify("something", [1, 2, 3]);

    assert.deepStrictEqual(store.events, [
      { key: "anything", value: { answer: 42 } },
      { key: "something", value: [1, 2, 3] },
    ]);
  });
});

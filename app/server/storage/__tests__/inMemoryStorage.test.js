import { describe, test } from "node:test";
import { strict as assert } from "node:assert";

import { EventBus } from "../../../../yop/dist/spa/event-bus.js";
import { InMemoryStorage, OnFileStorage } from "../storage.js";
import { unlinkSync } from "node:fs";

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

  test("can be Initialized with existing events", () => {
    const file = new URL("./on-file-storage.json", import.meta.url);
    try {
      unlinkSync(file);
    } catch {}
    const bus = new EventBus();
    const onFileStorage = new OnFileStorage(bus, file);
    bus.notify("anything", { answer: 42 });
    bus.notify("something", [1, 2, 3]);
    const store = new InMemoryStorage(bus, onFileStorage);

    assert.deepStrictEqual(store.events, [
      { key: "anything", value: { answer: 42 } },
      { key: "something", value: [1, 2, 3] },
    ]);
  });
});

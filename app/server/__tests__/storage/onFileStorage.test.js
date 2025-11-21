import { describe, test } from "node:test";
import { strict as assert } from "node:assert";

import { EventBus } from "../../../../yop/dist/spa/event-bus.js";
import { OnFileStorage } from "../../storage.js";
import { readFileSync, unlinkSync } from "node:fs";

describe("onFile storage", () => {
  test("saves key and value together", () => {
    const file = new URL("./on-file-storage.json", import.meta.url);
    try {
      unlinkSync(file);
    } catch {}
    const bus = new EventBus();
    new OnFileStorage(bus, file);
    bus.notify("anything", { answer: 42 });
    bus.notify("something", [1, 2, 3]);

    const content = readFileSync(file).toString();
    assert.deepStrictEqual(JSON.parse(content), {
      events: [
        { key: "anything", value: { answer: 42 } },
        { key: "something", value: [1, 2, 3] },
      ],
    });
  });
});

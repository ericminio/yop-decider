import { before, test } from "node:test";
import { strict as assert } from "node:assert";
import { describe, eventually } from "../../yop/dist/testing/index.js";

import { server } from "../server/server.js";
import { Proposition, User } from "../../domain/domain.js";

describe("error", server, (page) => {
  before(() => {
    const userNotSaved = new User({ name: "Charlie" });
    new Proposition(
      { owner: userNotSaved, text: "I propose that we start today" },
      { bus: server.bus },
    );
  });

  test("is reported on home page", { only: true }, async () => {
    await eventually(page, async () => {
      assert.match(await page.section("Error"), /Cannot/);
    });
    const toast = await page.find({ tag: "section", text: "Error" });

    await eventually(page, async () => {
      assert.ok(!toast.element.classList.contains("hidden"));
    });
  });

  test("can be discarded", async () => {
    await eventually(page, async () => {
      assert.match(await page.section("Error"), /Cannot/);
    });
    const toast = await page.find({ tag: "section", text: "Error" });
    await toast.element.click();

    await eventually(page, async () => {
      assert.ok(toast.element.classList.contains("hidden"));
    });
  });
});

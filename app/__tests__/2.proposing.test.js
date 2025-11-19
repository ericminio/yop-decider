import { before, test } from "node:test";
import { strict as assert } from "node:assert";
import { describe } from "../../yop/testing/describe.js";
import { eventually } from "../../yop/index.js";

import { server } from "../server/server.js";
import { User } from "../../domain/domain.js";

describe("proposing", server, (page) => {
  test("is offered from home page", async () => {
    await eventually(page, async () => {
      assert.match(await page.section("Decider"), /Propose/);
    });
  });
});

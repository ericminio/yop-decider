import { before, test } from "node:test";
import { strict as assert } from "node:assert";
import { describe } from "../../yop/testing/describe.js";
import { eventually } from "../../yop/index.js";

import { server } from "../server/server.js";
import { Proposition, User } from "../../domain/domain.js";

describe("error", server, (page) => {
  before(() => {
    const userNotSaved = new User({ name: "Charlie" });
    new Proposition(
      { owner: userNotSaved, text: "I propose that we start today" },
      server.bus,
    );
  });

  test("is reported on home page", async () => {
    await eventually(page, async () => {
      assert.match(
        await page.section("Error"),
        /Cannot read properties of undefined/,
      );
    });
  });
});

import { beforeEach, test } from "node:test";
import { strict as assert } from "node:assert";
import { describe } from "../yop/testing/describe.js";
import { eventually } from "../yop/index.js";

import { server } from "./server.js";
import { User } from "../domain/domain.js";

describe("home page", server, (page) => {
  beforeEach(async () => {
    const charlie = new User({ name: "Charlie" }, server.bus);
    charlie.proposes("I propose we start today");
  });

  test("displays existing proposition", async () => {
    await eventually(page, async () => {
      assert.match(
        await page.section("News"),
        /Charlie.*I propose we start today/,
      );
    });
  });
});

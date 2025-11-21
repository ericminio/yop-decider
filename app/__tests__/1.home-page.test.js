import { before, test } from "node:test";
import { strict as assert } from "node:assert";
import { describe, eventually } from "../../yop/dist/testing/index.js";

import { server } from "../server/server.js";
import { User } from "../../domain/domain.js";

describe("home page", server, (page) => {
  before(async () => {
    const charlie = new User({ name: "Charlie" }, server.bus);
    charlie.proposes("I propose we start today");
    const dana = new User({ name: "Dana" }, server.bus);
    dana.proposes("I propose we advance the launch");
  });

  test("displays existing propositions", async () => {
    await eventually(page, async () => {
      assert.match(
        await page.section("Propositions"),
        /Charlie.*I propose we start today/,
      );
    });
    await eventually(page, async () => {
      assert.match(
        await page.section("Propositions"),
        /Dana.*I propose we advance the launch/,
      );
    });
  });
});

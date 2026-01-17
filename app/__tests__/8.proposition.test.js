import { before, test } from "node:test";
import { strict as assert } from "node:assert";
import { describe, eventually } from "../../yop/dist/testing/index.js";

import { server } from "../server/server.js";
import { User } from "../../domain/domain.js";

describe("proposition page", server, (page) => {
  let proposition;

  before(async () => {
    const charlie = new User({ id: "Charlie" }, { bus: server.bus });
    proposition = charlie.proposes("I propose we start today");
    const alice = new User({ id: "Alice" }, { bus: server.bus });
    const bob = new User({ id: "Bob" }, { bus: server.bus });
    const jim = new User({ id: "Jim" }, { bus: server.bus });
    alice.vote("no", proposition);
    bob.vote("support", proposition);
    jim.vote("yes", proposition);
  });

  test("discloses proposition", async () => {
    await eventually(page, async () => {
      assert.match(
        await page.section("Propositions"),
        /I propose we start today/,
      );
    });
    await page.click("I propose we start today");
    await eventually(page, async () => {
      assert.match(
        await page.section("Proposition"),
        /Charlie.*I propose we start today/,
      );
    });
  });

  test("discloses voters segmentation", async () => {
    await eventually(page, async () => {
      assert.match(
        await page.section("Propositions"),
        /I propose we start today/,
      );
    });
    await page.click("I propose we start today");
    await eventually(page, async () => {
      assert.match(
        await page.section("Proposition"),
        /Challengers.*Alice.*Supporting.*Bob.*Committed.*Charlie, Jim/,
      );
    });
  });
});

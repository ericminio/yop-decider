import { before, test } from "node:test";
import { strict as assert } from "node:assert";
import { describe, eventually } from "../../yop/dist/testing/index.js";
import { Hash } from "../../yop/dist/crypto/hash.js";

import { server } from "../server/server.js";
import { User } from "../../domain/domain.js";

describe("voting", server, (page) => {
  before(() => {
    const charlie = new User(
      {
        name: "Charlie",
        password: new Hash().encrypt("password"),
      },
      server.bus,
    );
    charlie.proposes("I propose to put more cream");
  });

  test("has a teaser", async () => {
    await eventually(page, async () => {
      assert.match(await page.section("Propositions"), /Login to vote/);
    });
  });

  test("needs no teaser when logged in", async () => {
    await eventually(page, async () => {
      assert.match(await page.section("Propositions"), /Login to vote/);
    });
    await page.click("login");

    await eventually(page, async () => {
      assert.match(await page.section("Login"), /.*/);
    });
    await page.enter("Name", "Charlie");
    await page.enter("Password", "password");
    await page.click("Login");

    await eventually(page, async () => {
      const loginInvite = await page.find({
        tag: "div",
        text: "Login to vote",
      });
      assert.ok(loginInvite.element.classList.contains("hidden"));
    });
  });
});

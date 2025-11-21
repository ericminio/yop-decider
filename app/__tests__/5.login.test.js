import { test } from "node:test";
import { strict as assert } from "node:assert";
import { describe, eventually } from "../../yop/dist/testing/index.js";

import { server } from "../server/server.js";

describe("login", server, (page) => {
  test("is actually sign up when user does not exist yet", async () => {
    await eventually(page, async () => {
      assert.match(await page.section("Decider"), /login/);
    });
    await page.click("login");

    await eventually(page, async () => {
      assert.match(await page.section("Login"), /.*/);
    });
    await page.enter("Name", "Max");
    await page.enter("Password", "password");
    await page.click("Login");

    await eventually(page, async () => {
      assert.match(await page.section("Decider"), /Hi, Max/);
    });
  });
});

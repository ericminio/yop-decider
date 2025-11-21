import { before, test } from "node:test";
import { strict as assert } from "node:assert";
import { describe, eventually } from "../../yop/dist/testing/index.js";
import { Hash } from "../../yop/dist/crypto/hash.js";

import { server } from "../server/server.js";
import { User } from "../../domain/domain.js";

describe("proposing", server, (page) => {
  before(() => {
    new User(
      {
        name: "Charlie",
        password: new Hash().encrypt("password"),
      },
      server.bus,
    );
  });

  test("is offered from home page", async () => {
    await eventually(page, async () => {
      assert.match(await page.section("Decider"), /Propose/);
    });
  });

  test("requires authentication", async () => {
    await eventually(page, async () => {
      assert.match(await page.section("Decider"), /Propose/);
    });
    await page.click("Propose");

    await eventually(page, async () => {
      assert.match(await page.section("Login"), /.*/);
    });
  });

  test("is not possible without authenticating", async () => {
    await eventually(page, async () => {
      assert.match(await page.section("Decider"), /Propose/);
    });
    await page.click("Propose");

    await eventually(page, async () => {
      assert.match(await page.section("Login"), /.*/);
    });

    await page.enter("Name", "Charlie");
    await page.enter("Password", "wrong password");
    await page.click("Login");

    await eventually(page, async () => {
      assert.match(await page.section("Login"), /Invalid credentials/);
    });
  });

  test("is possible after authenticating", async () => {
    await eventually(page, async () => {
      assert.match(await page.section("Decider"), /Propose/);
    });
    await page.click("Propose");

    await eventually(page, async () => {
      assert.match(await page.section("Login"), /.*/);
    });
    await page.enter("Name", "Charlie");
    await page.enter("Password", "password");
    await page.click("Login");

    await eventually(page, async () => {
      assert.match(await page.section("Hi, Charlie"), /.*/);
    });
    await page.enter("new-proposal", "I propose that we start today");
    await page.click("Submit");

    await eventually(page, async () => {
      assert.match(await page.section("Hi, Charlie"), /Proposal submitted/);
    });
    await page.click("Continue");

    await eventually(page, async () => {
      assert.match(
        await page.section("News"),
        /Charlie.*I propose that we start today/,
      );
    });
  });
});

import { before, test } from "node:test";
import { strict as assert } from "node:assert";
import { describe, eventually } from "../../yop/dist/testing/index.js";

import { server } from "../server/server.js";
import { User } from "../../domain/domain.js";
import { Hash } from "../../yop/dist/crypto/hash.js";

describe("error", server, (page) => {
  before(() => {
    const charlie = new User(
      { name: "Charlie", password: new Hash().encrypt("password") },
      { bus: server.bus },
    );
    charlie.proposes("I propose that we start today");

    server.store.events.splice(1, 1);
  });

  test("is reported on home page", { only: true }, async () => {
    await login({ page, name: "Charlie", password: "password" });
    await eventually(page, async () => {
      assert.match(await page.section("Error"), /Cannot/);
    });
    const toast = await page.find({ tag: "section", text: "Error" });

    await eventually(page, async () => {
      assert.ok(!toast.element.classList.contains("hidden"));
    });
  });

  test("can be discarded", async () => {
    await login({ page, name: "Charlie", password: "password" });
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

const login = async ({ page, name, password }) => {
  await eventually(page, async () => {
    assert.ok(
      await page.find({
        tag: "button",
        text: "login",
      }),
    );
  });
  await page.click("login");

  await eventually(page, async () => {
    assert.match(await page.section("Login"), /.*/);
  });
  await page.enter("Name", name);
  await page.enter("Password", password);
  await page.click("Login");
};

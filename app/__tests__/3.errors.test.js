import { before, test } from "node:test";
import { strict as assert } from "node:assert";
import { describe, eventually } from "../../yop/dist/testing/index.js";

import { server } from "../server/server.js";
import { Proposition, User } from "../../domain/domain.js";
import { Hash } from "../../yop/dist/crypto/hash.js";
import { login } from "./login.js";

describe("error (for example a proposition without text)", server, (page) => {
  before(() => {
    const charlie = new User(
      { id: "Charlie", password: new Hash().encrypt("password") },
      { bus: server.bus },
    );
    new Proposition({ owner: charlie }, { bus: server.bus });
  });

  test("is reported on home page", { only: true }, async () => {
    await login({ page, id: "Charlie", password: "password" });
    await eventually(page, async () => {
      assert.match(await page.section("Error"), /Cannot/);
    });
    const toast = await page.find({ tag: "section", text: "Error" });

    await eventually(page, async () => {
      assert.ok(!toast.element.classList.contains("hidden"));
    });
  });

  test("can be discarded", async () => {
    await login({ page, id: "Charlie", password: "password" });
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

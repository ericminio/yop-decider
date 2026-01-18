import { before, test } from "node:test";
import { strict as assert } from "node:assert";
import { describe, eventually } from "../../yop/dist/testing/index.js";
import { Hash } from "../../yop/dist/crypto/hash.js";

import { server } from "../server/server.js";
import { User } from "../../domain/domain.js";

describe("proposition page", server, (page) => {
  let proposition;

  before(async () => {
    const charlie = new User({ id: "Charlie" }, { bus: server.bus });
    proposition = charlie.proposes("I propose we start today");
    const alice = new User({ id: "Alice" }, { bus: server.bus });
    const bob = new User(
      { id: "Bob", password: new Hash().encrypt("bob") },
      { bus: server.bus },
    );
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

  test("updates voters segmentation when user votes", async () => {
    await login({ page, id: "Bob", password: "bob" });
    await eventually(page, async () => {
      assert.match(
        await page.section("Propositions"),
        /I propose we start today/,
      );
    });
    await page.click("I propose we start today");
    await eventually(page, async () => {
      assert.match(await page.section("Committed"), /Charlie, Jim/);
    });
    const yes = await page.document.querySelector(".voting-button[name='yes']");
    yes.click();

    await eventually(page, async () => {
      assert.match(await page.section("Committed"), /Charlie, Bob, Jim/);
    });
  });
});

const login = async ({ page, id, password }) => {
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
  await page.enter("Name", id);
  await page.enter("Password", password);
  await page.click("Login");
};

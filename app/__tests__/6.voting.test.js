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
    await login({ page, name: "Charlie", password: "password" });

    await eventually(page, async () => {
      const loginInvite = await page.find({
        tag: "div",
        text: "Login to vote",
      });
      assert.ok(loginInvite.element.classList.contains("hidden"));
    });
  });

  test("is offered from the proposition card", async () => {
    await login({ page, name: "Charlie", password: "password" });
    await eventually(page, async () => {
      assert.match(
        await page.section("Propositions"),
        /I propose to put more cream/,
      );
    });
    await eventually(page, async () => {
      const votesSection = await page.document.querySelectorAll(
        ".proposition-card-votes",
      )[0];
      assert.equal(
        votesSection.getAttribute("class"),
        "proposition-card-votes",
      );
    });
  });

  test("is not offered from the proposition card when not logged in", async () => {
    await eventually(page, async () => {
      assert.match(
        await page.section("Propositions"),
        /I propose to put more cream/,
      );
    });
    await eventually(page, async () => {
      const votesSection = await page.document.querySelectorAll(
        ".proposition-card-votes",
      )[0];
      assert.equal(
        votesSection.getAttribute("class"),
        "proposition-card-votes hidden",
      );
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

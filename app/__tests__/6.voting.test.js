import { before, test } from "node:test";
import { strict as assert } from "node:assert";
import { describe, eventually } from "../../yop/dist/testing/index.js";
import { Hash } from "../../yop/dist/crypto/hash.js";

import { server } from "../server/server.js";
import { User } from "../../domain/domain.js";
import { login, logout } from "./login.js";

describe("voting", server, (page) => {
  before(() => {
    const charlie = new User(
      {
        id: "Charlie",
        password: new Hash().encrypt("password"),
      },
      { bus: server.bus },
    );
    charlie.proposes("I propose to put more cream");
  });

  test("has a teaser", async () => {
    await eventually(page, async () => {
      assert.match(await page.section("Propositions"), /Login to vote/);
    });
  });

  test("needs no teaser when logged in", async () => {
    await login({ page, id: "Charlie", password: "password" });

    await eventually(page, async () => {
      const loginInvite = await page.find({
        tag: "div",
        text: "Login to vote",
      });
      assert.ok(loginInvite.element.classList.contains("hidden"));
    });
  });

  test("is offered from the proposition card", async () => {
    await login({ page, id: "Charlie", password: "password" });
    await eventually(page, async () => {
      assert.match(
        await page.section("Propositions"),
        /I propose to put more cream/,
      );
    });
    await eventually(page, async () => {
      const propositionCard = await page.find({
        tag: "section",
        text: "I propose to put more cream",
      });
      const noButton = await propositionCard.element.querySelector(
        ".voting-button[name='no']",
      );
      assert.ok(!noButton.disabled);
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
      const propositionCard = await page.find({
        tag: "section",
        text: "I propose to put more cream",
      });
      const yesButton = await propositionCard.element.querySelector(
        ".voting-button[name='yes']",
      );
      assert.ok(yesButton.disabled);
    });
  });

  test("defaults to yes for the owner", { only: true }, async () => {
    await login({ page, id: "Charlie", password: "password" });
    await eventually(page, async () => {
      assert.match(
        await page.section("Propositions"),
        /I propose to put more cream/,
      );
    });
    await eventually(page, async () => {
      const propositionCard = await page.find({
        tag: "section",
        text: "I propose to put more cream",
      });
      const yesButton = await propositionCard.element.querySelector(
        ".voting-button[name='yes']",
      );
      assert.strictEqual(
        yesButton.getAttribute("class"),
        "voting-button voted",
      );
    });
  });

  test("belongs to a specific user", async () => {
    await login({ page, id: "Charlie", password: "password" });
    await eventually(page, async () => {
      assert.match(
        await page.section("Propositions"),
        /I propose to put more cream/,
      );
    });

    const voteButtonForCharlie = await page.document.querySelector(
      ".voting-button[name='no']",
    );
    voteButtonForCharlie.click();

    await eventually(page, async () => {
      assert.strictEqual(
        voteButtonForCharlie.getAttribute("class"),
        "voting-button voted",
      );
    });
    await logout({ page });
    await login({ page, id: "Dana", password: "password" });
    await eventually(page, async () => {
      assert.match(
        await page.section("Propositions"),
        /I propose to put more cream/,
      );
    });

    await eventually(page, async () => {
      const voteButtonForDana = await page.document.querySelector(
        ".voting-button[name='no']",
      );
      assert.strictEqual(
        voteButtonForDana.getAttribute("class"),
        "voting-button",
      );
    });

    await logout({ page });
    await login({ page, id: "Charlie", password: "password" });
    await eventually(page, async () => {
      assert.match(
        await page.section("Propositions"),
        /I propose to put more cream/,
      );
    });
    await eventually(page, async () => {
      const voteButtonForCharlieAgain = await page.document.querySelector(
        ".voting-button[name='no']",
      );
      assert.strictEqual(
        voteButtonForCharlieAgain.getAttribute("class"),
        "voting-button voted",
      );
    });
  });
});

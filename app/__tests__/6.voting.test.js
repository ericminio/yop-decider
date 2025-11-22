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
      const propositionCard = await page.find({
        tag: "section",
        text: "I propose to put more cream",
      });
      const votesSection = await propositionCard.element.querySelector(
        ".proposition-card-votes",
      );
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
      const propositionCard = await page.find({
        tag: "section",
        text: "I propose to put more cream",
      });
      const votesSection = await propositionCard.element.querySelector(
        ".proposition-card-votes",
      );
      assert.equal(
        votesSection.getAttribute("class"),
        "proposition-card-votes hidden",
      );
    });
  });

  test("belongs to a specific user", async () => {
    await login({ page, name: "Charlie", password: "password" });
    await eventually(page, async () => {
      assert.match(
        await page.section("Propositions"),
        /I propose to put more cream/,
      );
    });
    const yesButtonForCharlie = await page.document.querySelector(
      ".proposition-card-votes .voting-button[name='yes']",
    );
    yesButtonForCharlie.click();

    await eventually(page, async () => {
      assert.strictEqual(
        yesButtonForCharlie.getAttribute("class"),
        "voting-button voted",
      );
    });
    await logout({ page });
    await login({ page, name: "Dana", password: "password" });
    await eventually(page, async () => {
      assert.match(
        await page.section("Propositions"),
        /I propose to put more cream/,
      );
    });
    const yesButtonForDana = await page.document.querySelector(
      ".proposition-card-votes .voting-button[name='yes']",
    );
    assert.strictEqual(yesButtonForDana.getAttribute("class"), "voting-button");

    await logout({ page });
    await login({ page, name: "Charlie", password: "password" });
    await eventually(page, async () => {
      assert.match(
        await page.section("Propositions"),
        /I propose to put more cream/,
      );
    });
    const yesButtonForCharlieAgain = await page.document.querySelector(
      ".proposition-card-votes .voting-button[name='yes']",
    );
    assert.strictEqual(
      yesButtonForCharlieAgain.getAttribute("class"),
      "voting-button voted",
    );
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

const logout = async ({ page }) => {
  await eventually(page, async () => {
    assert.ok(
      await page.find({
        tag: "button",
        text: "logout",
      }),
    );
  });
  await page.click("logout");
};

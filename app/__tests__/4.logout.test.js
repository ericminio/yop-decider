import { before, test } from "node:test";
import { strict as assert } from "node:assert";
import { describe, eventually } from "../../yop/dist/testing/index.js";
import { Hash } from "../../yop/dist/crypto/hash.js";

import { server } from "../server/server.js";
import { User } from "../../domain/domain.js";

describe("logout", server, (page) => {
  before(() => {
    new User(
      {
        name: "Charlie",
        password: new Hash().encrypt("password"),
      },
      server.bus,
    );
  });

  test("becomes available after login", async () => {
    await eventually(page, async () => {
      assert.match(await page.section("Decider"), /login/);
    });
    await eventually(page, async () => {
      const loginButton = await page.find({ tag: "button", text: "login" });
      assert.ok(!loginButton.element.classList.contains("hidden"));
    });
    await eventually(page, async () => {
      const logoutButton = await page.find({ tag: "button", text: "logout" });
      assert.ok(logoutButton.element.classList.contains("hidden"));
    });
    await page.click("login");

    await eventually(page, async () => {
      assert.match(await page.section("Login"), /.*/);
    });

    await page.enter("Name", "Charlie");
    await page.enter("Password", "password");
    await page.click("Login");

    await eventually(page, async () => {
      assert.match(await page.section("Decider"), /Hi, Charlie/);
    });

    await eventually(page, async () => {
      assert.match(await page.section("Decider"), /logout/);
    });
    await eventually(page, async () => {
      const loginButtonAfterLogin = await page.find({
        tag: "button",
        text: "login",
      });
      assert.ok(loginButtonAfterLogin.element.classList.contains("hidden"));
    });
    await eventually(page, async () => {
      const logoutButtonAfterLogin = await page.find({
        tag: "button",
        text: "logout",
      });
      assert.ok(!logoutButtonAfterLogin.element.classList.contains("hidden"));
    });

    await page.click("logout");
    await eventually(page, async () => {
      const loginButtonAfterLogout = await page.find({
        tag: "button",
        text: "login",
      });
      assert.ok(!loginButtonAfterLogout.element.classList.contains("hidden"));
    });
    await eventually(page, async () => {
      const logoutButtonAfterLogout = await page.find({
        tag: "button",
        text: "logout",
      });
      assert.ok(logoutButtonAfterLogout.element.classList.contains("hidden"));
    });
  });
});

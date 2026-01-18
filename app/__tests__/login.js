import { strict as assert } from "node:assert";
import { eventually } from "../../yop/dist/testing/index.js";

export const login = async ({ page, id, password }) => {
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

export const logout = async ({ page }) => {
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

import {
  describe,
  before,
  after,
  beforeEach,
  afterEach,
  test,
} from "node:test";
import { strict as assert } from "node:assert";
import { server } from "../../../server/server.js";
import { Page } from "../../../../yop/testing/page-jsdom.js";
import { eventually } from "../../../../yop/index.js";

describe("proposing", () => {
  let page;
  let baseUrl;
  before(async () => {
    const port = await server.start();
    baseUrl = `http://localhost:${port}/new`;
  });
  after(async () => {
    await server.stop();
  });
  beforeEach(async () => {
    page = new Page();
    await page.open(baseUrl);
  });
  afterEach(async () => {
    await page.close();
  });

  test("requires authentication", async () => {
    await eventually(page, async () => {
      assert.match(await page.section("Login"), /.*/);
    });
  });
});

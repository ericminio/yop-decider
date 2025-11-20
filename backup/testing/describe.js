import {
  describe as nodeDescribe,
  before,
  after,
  beforeEach,
  afterEach,
} from "node:test";
import { Page } from "./page.js";

export const describe = (title, server, cb) => {
  nodeDescribe("app", async () => {
    let page;
    let baseUrl;
    before(async () => {
      const port = await server.start();
      baseUrl = `http://localhost:${port}`;
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

    nodeDescribe(title, () => {
      const pageProxy = new Proxy(
        {},
        {
          get(_, prop) {
            return page[prop];
          },
        },
      );
      cb(pageProxy);
    });
  });
};

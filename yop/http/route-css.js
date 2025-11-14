import { serveContent } from "./serve-content.js";
import { css } from "./css.js";

export class RouteCss {
  constructor(pattern, base) {
    this.pattern = pattern;
    this.contentProvider = css(pattern, base);
  }

  matches(incoming) {
    return this.pattern.test(incoming.url);
  }

  go(request, response) {
    serveContent(this.contentProvider)(request, response);
  }
}

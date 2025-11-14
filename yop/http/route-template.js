import { serveContent } from "./serve-content.js";
import { template } from "./template.js";

export class RouteTemplate {
  constructor(pattern, base) {
    this.pattern = pattern;
    this.contentProvider = template(pattern, base);
  }

  matches(incoming) {
    return this.pattern.test(incoming.url);
  }

  go(request, response) {
    serveContent(this.contentProvider)(request, response);
  }
}

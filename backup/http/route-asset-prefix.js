import { serveContent } from "./serve-content.js";

export class RouteAssetPrefix {
  constructor(prefix, contentProvider) {
    this.prefix = prefix;
    this.contentProvider = contentProvider;
  }

  matches(incoming) {
    return incoming.url.indexOf(this.prefix) === 0;
  }

  go(request, response) {
    serveContent(this.contentProvider)(request, response);
  }
}

import { yop } from "../spa/yop.js";
import { serveContent } from "./serve-content.js";

export class RouteYop {
  matches(incoming) {
    return incoming.url === "/yop.js";
  }

  go(request, response) {
    serveContent(yop)(request, response);
  }
}

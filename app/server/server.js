import {
  EventBus,
  RouteCss,
  RouteDefault,
  RouteTemplate,
  RouteYop,
  Router,
  RouterLog,
  Server,
  html,
} from "../../yop/index.js";
import { InMemoryEvents } from "./storage.js";
import { RouteApp } from "./route-app.js";
import { RouteDomain } from "./route-domain.js";
import { RouteGetEvents } from "./route-get-events.js";
import { RoutePostEvent } from "./route-post-event.js";
import { RouteAuthenticate } from "./route-authenticate.js";

export const server = new Server();
server.bus = new EventBus();
server.store = new InMemoryEvents(server.bus);

const router = new Router([
  new RouterLog(),
  new RouteYop(),
  new RouteDomain(),
  new RouteApp(),
  new RouteGetEvents(server),
  new RoutePostEvent(server),
  new RouteAuthenticate(server),

  new RouteTemplate(/^\/templates\/(.*)/, new URL("../web", import.meta.url)),
  new RouteCss(/\/css\/(.*)/, new URL("..", import.meta.url)),
  new RouteDefault(html(new URL("../index.html", import.meta.url))),
]);

server.use(router.handler.bind(router));

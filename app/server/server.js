import {
  EventBus,
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

const router = new Router([
  new RouterLog(),
  new RouteYop(),
  new RouteDomain(),
  new RouteApp(),
  {
    matches: (incoming) =>
      incoming.method === "GET" && incoming.url.startsWith("/events"),
    go: (_, response) => {
      response.writeHead(200, { "Content-Type": "application/json" });
      response.end(JSON.stringify({ events: server.store.events }));
    },
  },
  new RouteTemplate(/^\/templates\/(.*)/, new URL("../web", import.meta.url)),
  new RouteDefault(html(new URL("../index.html", import.meta.url))),
]);

export const server = new Server(router.handler.bind(router));

server.bus = new EventBus();
server.store = new InMemoryEvents(server.bus);

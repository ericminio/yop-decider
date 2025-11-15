import {
  EventBus,
  RouteAssetEqual,
  RouteDefault,
  RouteTemplate,
  RouteYop,
  Router,
  RouterLog,
  Server,
  contentOfFile,
  html,
  scripts,
} from "../yop/index.js";
import { InMemoryEvents } from "../store/inMemoryEvents.js";
import { RouteApp } from "./web/route-app.js";
import { RouteDomain } from "./web/route-domain.js";

const router = new Router([
  new RouterLog(),
  new RouteYop(),
  new RouteApp(),
  new RouteDomain(),
  {
    matches: (incoming) =>
      incoming.method === "GET" && incoming.url.startsWith("/events"),
    go: (_, response) => {
      response.writeHead(200, { "Content-Type": "application/json" });
      response.end(JSON.stringify({ events: server.store.events }));
    },
  },
  new RouteTemplate(/^\/templates\/(.*)/, new URL("./web", import.meta.url)),
  new RouteDefault(html(new URL("./index.html", import.meta.url))),
]);

export const server = new Server(router.handler.bind(router));

server.bus = new EventBus();
server.store = new InMemoryEvents(server.bus);

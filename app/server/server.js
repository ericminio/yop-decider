import {
  RouteCss,
  RouteDefault,
  RouteTemplate,
  RouteYop,
  Router,
  RouterLog,
  Server,
  html,
} from "../../yop/dist/http/index.js";
import { EventBus } from "../../yop/dist/spa/event-bus.js";
import { InMemoryStorage, OnFileStorage } from "./storage/storage.js";
import { RouteApp } from "./route-app.js";
import { RouteDomain } from "./route-domain.js";
import { RouteGetEvents } from "./route-get-events.js";
import { RoutePostEvent } from "./route-post-event.js";
import { RouteAuthenticate } from "./route-authenticate.js";

const bus = new EventBus();
let inMemoryStorage;
if (process.argv[1].endsWith("test.js")) {
  inMemoryStorage = new InMemoryStorage(bus);
} else {
  let onFileStorage = new OnFileStorage(
    bus,
    new URL("../../events.json", import.meta.url),
  );
  inMemoryStorage = new InMemoryStorage(bus, onFileStorage);
}
export const server = new Server();
server.bus = bus;
server.store = inMemoryStorage;

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

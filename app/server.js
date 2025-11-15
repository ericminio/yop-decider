import {
  RouteAssetEqual,
  RouteDefault,
  RouteTemplate,
  RouteYop,
  Router,
  Server,
  html,
  scripts,
} from "../yop/index.js";
import { EventBus } from "../domain/event-bus.js";
import { InMemoryEvents } from "../store/inMemoryEvents.js";

const router = new Router([
  {
    matches: (incoming) => incoming.url.startsWith("/propositions"),
    go: (_, response) => {
      const propositions = server.store.events
        .filter((e) => e.event === "proposition.created")
        .map((e) => e.data);
      response.writeHead(200, { "Content-Type": "application/json" });
      response.end(JSON.stringify({ propositions }));
    },
  },
  new RouteAssetEqual(
    "/app.js",
    scripts(
      ["./web/home/index.js", "./web/propositions/index.js"],
      import.meta.url,
    ),
  ),
  new RouteYop(),
  new RouteTemplate(/^\/templates\/(.*)/, new URL("./web", import.meta.url)),
  new RouteDefault(html(new URL("./index.html", import.meta.url))),
]);

export const server = new Server(router.handler.bind(router));

server.bus = new EventBus();
server.store = new InMemoryEvents(server.bus);

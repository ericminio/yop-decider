import {
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
import { EventBus } from "../domain/event-bus.js";
import { InMemoryEvents } from "../store/inMemoryEvents.js";

const router = new Router([
  new RouterLog(),
  new RouteYop(),
  new RouteTemplate(/^\/templates\/(.*)/, new URL("./web", import.meta.url)),
  new RouteAssetEqual(
    "/app.js",
    scripts(
      ["./fetcher.js", "./web/home/index.js", "./web/propositions/index.js"],
      import.meta.url,
    ),
  ),
  new RouteAssetEqual("/domain.js", () => ({
    contentType: "application/javascript",
    content: contentOfFile(
      new URL("../domain/domain.js", import.meta.url),
    ).replace(/export /g, ""),
  })),
  {
    matches: (incoming) =>
      incoming.method === "GET" && incoming.url.startsWith("/events"),
    go: (_, response) => {
      const events = server.store.events;
      response.writeHead(200, { "Content-Type": "application/json" });
      response.end(JSON.stringify({ events }));
    },
  },
  new RouteDefault(html(new URL("./index.html", import.meta.url))),
]);

export const server = new Server(router.handler.bind(router));

server.bus = new EventBus();
server.store = new InMemoryEvents(server.bus);

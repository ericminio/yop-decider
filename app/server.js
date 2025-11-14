import { RouteDefault, Router, Server, html } from "../yop/index.js";
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
  new RouteDefault(html(new URL("./index.html", import.meta.url))),
]);

export const server = new Server(router.handler.bind(router));

server.bus = new EventBus();
server.store = new InMemoryEvents(server.bus);

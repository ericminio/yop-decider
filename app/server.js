import { RouteDefault, Router, Server, html } from "../yop/index.js";

const router = new Router([
  {
    matches: (incoming) => incoming.url.startsWith("/propositions"),
    go: (_, response) => {
      const propositions = [
        { text: "I propose we start today", owner: "Charlie" },
      ];
      response.writeHead(200, { "Content-Type": "application/json" });
      response.end(JSON.stringify({ propositions }));
    },
  },
  new RouteDefault(html(new URL("./index.html", import.meta.url))),
]);

export const server = new Server(router.handler.bind(router));

import { RouteDefault, Router, Server, html } from "../yop/index.js";

const router = new Router([
  new RouteDefault(html(new URL("./index.html", import.meta.url))),
]);

export const server = new Server(router.handler.bind(router));

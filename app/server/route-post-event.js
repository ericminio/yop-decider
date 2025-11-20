import { payload } from "../../yop/dist/http/index.js";

export class RoutePostEvent {
  constructor(server) {
    this.server = server;
  }

  matches(incoming) {
    return incoming.method === "POST" && incoming.url.startsWith("/events");
  }

  async go(request, response) {
    const body = await payload(request);
    const event = JSON.parse(body);
    this.server.bus.notify(event.key, event.value);

    response.writeHead(201, { "Content-Type": "text/plain" });
    response.end("CREATED");
  }
}

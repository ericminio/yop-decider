export class RouteGetEvents {
  constructor(server) {
    this.server = server;
  }

  matches(incoming) {
    return incoming.method === "GET" && incoming.url.startsWith("/events");
  }

  async go(_, response) {
    response.writeHead(200, { "Content-Type": "application/json" });
    response.end(JSON.stringify({ events: this.server.store.events }));
  }
}

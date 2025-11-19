export class RoutePostEvent {
  constructor(server) {
    this.server = server;
  }

  matches(incoming) {
    return incoming.method === "POST" && incoming.url.startsWith("/events");
  }

  async go(request, response) {
    const event = await new Promise((resolve) => {
      let body = "";
      request.on("data", (chunk) => {
        body += chunk.toString();
      });
      request.on("end", () => {
        const event = JSON.parse(body);
        resolve(event);
      });
    });
    this.server.bus.notify(event.key, event.value);
    
    response.writeHead(201, { "Content-Type": "text/plain" });
    response.end("CREATED");
  }
}

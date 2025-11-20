import { payload } from "../../yop/dist/http/index.js";
import { Hash } from "../../yop/dist/crypto/hash.js";

export class RouteAuthenticate {
  constructor(server) {
    this.server = server;
  }

  matches(incoming) {
    return (
      incoming.method === "POST" && incoming.url.startsWith("/authenticate")
    );
  }

  async go(request, response) {
    const encodedCredentials = await payload(request);
    const decoded = Buffer.from(encodedCredentials, "base64").toString("ascii");
    const { name, password } = JSON.parse(decoded);
    const encryptedPassword = new Hash().encrypt(password);
    const authenticated = this.server.store.events.some(
      ({ key, value }) =>
        key === "user.created" &&
        value.name === name &&
        value.password === encryptedPassword,
    );
    if (!authenticated) {
      response.writeHead(401, { "Content-Type": "text/plain" });
      response.end("Unauthorized");
      return;
    }
    response.writeHead(200, { "Content-Type": "text/plain" });
    response.end("OK");
  }
}

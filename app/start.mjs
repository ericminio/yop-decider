import { User } from "../domain/domain.js";
import { Hash } from "../yop/crypto/index.js";
import { server } from "./server/server.js";

if (!process.argv[1].endsWith("test.js")) {
  server.start((port) => {
    console.log(`listening on port ${port}`);
    server.bus.registerForAll((value, key) => {
      console.log(`event ${key}`, value);
    });

    new User(
      {
        name: "Charlie",
        password: new Hash().encrypt("password"),
      },
      server.bus,
    );
  });
}

import { before, test } from "node:test";
import { strict as assert } from "node:assert";
import { describe, eventually } from "../../yop/dist/testing/index.js";

import { server } from "../server/server.js";
import { User } from "../../domain/domain.js";

describe("votes counts", server, (page) => {
  before(async () => {
    const charlie = new User({ id: "Charlie" }, { bus: server.bus });
    const proposition = charlie.proposes("I propose we start today");
    const alice = new User({ id: "Alice" }, { bus: server.bus });
    const bob = new User({ id: "Bob" }, { bus: server.bus });
    alice.vote("no", proposition);
    bob.vote("no", proposition);
  });

  test("is displayed along with the proposition", async () => {
    await eventually(page, async () => {
      assert.match(
        await page.section("Propositions"),
        /I propose we start today.*1.*0.*2/,
      );
    });
  });
});

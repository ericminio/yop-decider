import { describe, test } from "node:test";
import { strict as assert } from "node:assert";

import { Hash } from "../hash.js";

describe("Hash", () => {
  test("can encrypt changeme", () => {
    assert.equal(
      new Hash().encrypt("changeme"),
      "057ba03d6c44104863dc7361fe4578965d1887360f90a0895882e58a6248fc86",
    );
  });

  test("can encrypt password", () => {
    assert.equal(
      new Hash().encrypt("password"),
      "5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8",
    );
  });
});

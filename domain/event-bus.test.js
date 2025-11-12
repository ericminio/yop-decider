import { describe, it, beforeEach } from "node:test";
import { strict as assert } from "node:assert";

import { EventBus } from "./event-bus.js";

describe("events bus", () => {
  let eventBus;
  beforeEach(() => {
    eventBus = new EventBus();
  });

  it("will update registered component", () => {
    let received;
    let component = {
      update: (value) => {
        received = value;
      },
    };
    eventBus.register(component, "this event");
    eventBus.notify("this event", 42);

    assert.equal(received, 42);
  });

  it("will not update registered component for a different event", () => {
    let received;
    let component = {
      update: (value) => {
        received = value;
      },
    };
    eventBus.register(component, "this event");
    eventBus.notify("that event", 42);

    assert.equal(received, undefined);
  });

  it("will update all components registered with this event", () => {
    let first;
    let second;
    eventBus.register(
      {
        update: (value) => {
          first = value;
        },
      },
      "event",
    );
    eventBus.register(
      {
        update: (value) => {
          second = value;
        },
      },
      "event",
    );
    eventBus.notify("event", 42);

    assert.equal(first, 42);
    assert.equal(second, 42);
  });

  it("will call registered callback", () => {
    let received;
    let callback = (value) => {
      received = value;
    };
    eventBus.register(callback, "that event");
    eventBus.notify("that event", 42);

    assert.equal(received, 42);
  });

  it("needs binding to call registered callback in context", () => {
    let received;
    class Foo {
      constructor() {
        this.value = 39;
        eventBus.register(this.listen.bind(this), "event");
      }
      listen(value) {
        received = this.value + value;
      }
    }
    new Foo();
    eventBus.notify("event", 3);

    assert.equal(received, 42);
  });

  it("accepts registration with regular expression", () => {
    let received;
    let callback = (value) => {
      received = value;
    };
    eventBus.register(callback, /that event/);
    eventBus.notify("matching that event :)", 42);

    assert.equal(received, 42);
  });

  it("accepts registration for all events", () => {
    let received;
    let callback = (value, key) => {
      received = `${value}-${key}`;
    };
    eventBus.registerForAll(callback);
    eventBus.notify("any event", 42);

    assert.equal(received, "42-any event");
  });

  describe("unregister", () => {
    it("is available", () => {
      let spy;
      let id = eventBus.register(
        {
          update: (value) => {
            spy = value;
          },
        },
        "event",
      );
      eventBus.unregister(id);
      eventBus.notify("event", 42);

      assert.equal(spy, undefined);
    });
    it("ignores unknown id", () => {
      let spy;
      let id = eventBus.register(
        {
          update: (value) => {
            spy = value;
          },
        },
        "event",
      );
      eventBus.unregister(id + 1);
      eventBus.notify("event", 42);

      assert.equal(spy, 42);
    });
    it("is available for a bulk of ids", () => {
      let one = eventBus.register({ update: () => {} }, "this event");
      let two = eventBus.register({ update: () => {} }, "that event");
      eventBus.unregisterAll([one, two]);

      assert.deepStrictEqual(eventBus.listeners, {});
    });
    it("is available for registration made with regular expression", () => {
      let spy;
      const callback = (value) => {
        spy = value;
      };
      const id = eventBus.register(callback, /that event/);
      eventBus.unregister(id);
      eventBus.notify("that event", 42);

      assert.equal(spy, undefined);
    });
    it("is available for listeners listening all events", () => {
      let spy;
      const callback = (value) => {
        spy = value;
      };
      const id = eventBus.registerForAll(callback);
      eventBus.unregister(id);
      eventBus.notify("any event", 42);

      assert.equal(spy, undefined);
    });
  });

  describe("emptyness", () => {
    it("is the starting point", () => {
      assert.ok(eventBus.isEmpty());
    });
    it("becomes history once registration happens", () => {
      eventBus.register({ update: () => {} }, "this event");
      assert.equal(eventBus.isEmpty(), false);
    });
    it("becomes history once registration happens via regular expression", () => {
      eventBus.register({ update: () => {} }, /this event/);
      assert.equal(eventBus.isEmpty(), false);
    });
    it("becomes history once registration happens for all events", () => {
      eventBus.registerForAll({ update: () => {} });
      assert.equal(eventBus.isEmpty(), false);
    });
    it("can be effective again after unregistration", () => {
      let id = eventBus.register({ update: () => {} }, "event");
      eventBus.unregister(id);
      assert.ok(eventBus.isEmpty());
    });
  });
});

class EventBus {
  constructor() {
    this.id = 0;
    this.listeners = {};
    this.patterns = [];
    this.listenersForAll = [];
  }
  isEmpty() {
    return (
      Object.keys(this.listeners).length == 0 &&
      this.patterns.length === 0 &&
      this.listenersForAll.length === 0
    );
  }
  notify(key, value) {
    if (this.listeners[key]) {
      for (const { listener } of this.listeners[key]) {
        this.notifyListener(listener, key, value);
      }
    }
    for (const { pattern, listener } of this.patterns) {
      if (pattern.test(key)) {
        this.notifyListener(listener, key, value);
      }
    }
    for (const { listener } of this.listenersForAll) {
      this.notifyListener(listener, key, value);
    }
  }
  notifyListener(listener, key, value) {
    if (typeof listener == "object") {
      listener.update(value, key);
    }
    if (typeof listener == "function") {
      listener(value, key);
    }
  }
  register(listener, key) {
    return this.save(listener, key, this.listeners);
  }
  registerForAll(listener) {
    this.id += 1;
    this.listenersForAll.push({ id: this.id, listener: listener });
    return this.id;
  }
  unregister(id) {
    this.remove(id, this.listeners);
    const foundInPatterns = this.patterns.find((p) => p.id === id);
    if (foundInPatterns) {
      this.patterns.splice(this.patterns.indexOf(foundInPatterns), 1);
    }
    const foundInListenersForAll = this.listenersForAll.find(
      (p) => p.id === id,
    );
    if (foundInListenersForAll) {
      this.listenersForAll.splice(
        this.listenersForAll.indexOf(foundInListenersForAll),
        1,
      );
    }
  }
  unregisterAll(ids) {
    for (const id of ids) {
      this.unregister(id);
    }
  }

  save(listener, key, map) {
    this.id += 1;
    if (typeof key === "string") {
      if (map[key] === undefined) {
        map[key] = [];
      }
      map[key].push({ id: this.id, listener: listener });
    } else {
      this.patterns.push({ id: this.id, pattern: key, listener });
    }
    return this.id;
  }
  remove(id, map) {
    for (const key of Object.keys(map)) {
      for (let j = 0; j < map[key].length; j++) {
        let entry = map[key][j];
        if (entry.id == id) {
          map[key].splice(j, 1);
        }
      }
      if (map[key] == 0) {
        delete map[key];
      }
    }
  }
}
var eventBus = new EventBus();

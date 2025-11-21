import { readFileSync, writeFileSync } from "node:fs";

export class InMemoryStorage {
  constructor(bus, onFileStorage) {
    this.events = [];
    if (onFileStorage) {
      for (const event of onFileStorage.loadEvents()) {
        this.events.push(event);
      }
    }
    bus.registerForAll(this);
  }
  update(value, key) {
    this.events.push({ key, value });
  }
}

export class OnFileStorage {
  constructor(bus, file) {
    this.file = file;
    bus.registerForAll(this);
  }
  update(value, key) {
    let all = { events: this.loadEvents() };
    all.events.push({ key, value });
    writeFileSync(this.file, JSON.stringify(all, null, 2));
  }
  loadEvents() {
    try {
      const content = readFileSync(this.file).toString();
      const all = JSON.parse(content);
      return all.events;
    } catch {
      return [];
    }
  }
}

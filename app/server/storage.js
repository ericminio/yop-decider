import { readFileSync, writeFileSync } from "node:fs";

export class InMemoryStorage {
  constructor(bus) {
    this.events = [];
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
    let all = { events: [] };
    try {
      const content = readFileSync(this.file).toString();
      all = JSON.parse(content);
    } catch {}
    all.events.push({ key, value });
    writeFileSync(this.file, JSON.stringify(all, null, 2));
  }
}

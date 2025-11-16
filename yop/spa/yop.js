import { scripts } from "../http/scripts.js";

export const yop = scripts(
  [
    "./store.js",
    "./event-bus.js",
    "./event-bus-new.js",
    "./navigate.js",
    "./route.js",
    "./yop-element.js",
  ],
  import.meta.url,
);

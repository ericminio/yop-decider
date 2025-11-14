import { contentOfFile } from "../index.js";

const isUrl = (incoming) => {
  try {
    new URL(incoming);
    return true;
  } catch {
    return false;
  }
};

export const css = (pattern, base) => (incoming) => {
  let file = pattern;
  if (!isUrl(file)) {
    const data = pattern.exec(incoming.url);
    const url = data[1];
    file = new URL(`${base}/${url}`);
  }
  return {
    content: contentOfFile(file),
    contentType: "text/css",
  };
};

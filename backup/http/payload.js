import { binaryContentTypes } from "./content-types.js";

export const payload = (incoming) => {
  const contentTypeIndex = incoming.rawHeaders.indexOf("Content-Type");
  if (
    contentTypeIndex > 0 &&
    binaryContentTypes.includes(incoming.rawHeaders[contentTypeIndex + 1])
  ) {
    return new Promise((resolve, reject) => {
      const body = [];
      incoming.on("data", (chunk) => {
        body.push(Buffer.from(chunk, "binary"));
      });
      incoming.on("end", () => {
        resolve(Buffer.concat(body));
      });
      incoming.on("error", reject);
    });
  }
  return new Promise((resolve, reject) => {
    let body = "";
    incoming.on("data", (chunk) => {
      body += chunk;
    });
    incoming.on("end", () => {
      resolve(body);
    });
    incoming.on("error", reject);
  });
};

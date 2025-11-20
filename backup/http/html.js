import { contentOfFile } from "../files/content-of-file.js";

export const html = (file) => () => ({
  content: contentOfFile(file),
  contentType: "text/html",
});

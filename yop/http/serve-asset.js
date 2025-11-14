import {
  contentOfBinaryFile,
  contentOfFile,
  fileExists,
} from "../files/content-of-file.js";
import { notFound } from "./route-404.js";

const mime = {
  html: "text/html",
  js: "application/javascript",
  css: "text/css",
  png: "image/png",
  jpg: "image/jpeg",
};

export const serveAsset = (url) => {
  if (url.pathname.endsWith("/") && fileExists(new URL("./index.html", url))) {
    url = new URL("./index.html", url);
  }
  try {
    const extension = url.pathname.substring(url.pathname.lastIndexOf(".") + 1);
    const type = mime[extension];
    const content = type.startsWith("image")
      ? contentOfBinaryFile(url)
      : contentOfFile(url);

    return (request, response) => {
      response.setHeader("Content-Length", content.length);
      response.setHeader("Content-Type", type);
      response.setHeader("Cache-Control", "max-age=45");
      type.startsWith("image")
        ? response.end(content, "binary")
        : response.end(content);
    };
  } catch (error) {
    return notFound;
  }
};

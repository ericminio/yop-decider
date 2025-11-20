import { serveAsset } from "./serve-asset.js";

export const serveAssets = (base) => (request, response) => {
  serveAsset(new URL("." + request.url, base))(request, response);
};

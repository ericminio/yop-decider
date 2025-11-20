import { contentOfFile } from "../../yop/dist/files/content-of-file.js";
import { RouteAssetEqual } from "../../yop/dist/http/index.js";

export class RouteDomain extends RouteAssetEqual {
  constructor() {
    super("/domain.js", () => ({
      contentType: "application/javascript",
      content: contentOfFile(
        new URL("../../domain/domain.js", import.meta.url),
      ).replace(/export /g, ""),
    }));
  }
}

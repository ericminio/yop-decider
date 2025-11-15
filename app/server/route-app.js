import { RouteAssetEqual, scripts } from "../../yop/index.js";

export class RouteApp extends RouteAssetEqual {
  constructor() {
    super(
      "/app.js",
      scripts(
        [
          "../web/fetcher.js",
          "../web/home/index.js",
          "../web/propositions/index.js",
        ],
        import.meta.url,
      ),
    );
  }
}

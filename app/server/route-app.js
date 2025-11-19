import { RouteAssetEqual, scripts } from "../../yop/index.js";

export class RouteApp extends RouteAssetEqual {
  constructor() {
    super(
      "/app.js",
      scripts(
        [
          "../web/fetcher.js",
          "../web/menu/index.js",
          "../web/home/index.js",
          "../web/propositions/index.js",
          "../web/login/index.js",
        ],
        import.meta.url,
      ),
    );
  }
}

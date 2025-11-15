import { RouteAssetEqual, scripts } from "../../yop/index.js";

export class RouteApp extends RouteAssetEqual {
  constructor() {
    super(
      "/app.js",
      scripts(
        ["./fetcher.js", "./home/index.js", "./propositions/index.js"],
        import.meta.url,
      ),
    );
  }
}

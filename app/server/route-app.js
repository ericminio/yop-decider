import { RouteAssetEqual, scripts } from "../../yop/dist/http/index.js";

export class RouteApp extends RouteAssetEqual {
  constructor() {
    super(
      "/app.js",
      scripts(
        [
          "../web/fetcher.js",
          "../web/authenticator.js",
          "../web/eventPoster.js",

          "../web/_components/maybe-user.js",
          "../web/_components/propositionCard/index.js",
          "../web/_components/spinner/index.js",
          "../web/_components/error/index.js",
          "../web/_components/menu/index.js",
          "../web/_components/propositions/index.js",

          "../web/home/index.js",
          "../web/login/index.js",
          "../web/new/index.js",
        ],
        import.meta.url,
      ),
    );
  }
}

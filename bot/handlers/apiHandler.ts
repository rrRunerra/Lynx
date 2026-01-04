import { glob } from "glob";
import { LynxClient } from "../client/client";
import path from "path";
import { pathToFileURL } from "url";
import { API } from "../structures/Api";
import express from "express";
import cors from "cors";

export class APIHandler {
  public client: LynxClient;
  public app: express.Application;
  public router: express.Router;
  public lynxPort: number = Number(process.env.LYNX_PORT) || 4444;

  constructor(client: LynxClient) {
    this.client = client;
    this.app = express();
    this.router = express.Router();
  }

  public async loadAPI() {
    const files = (await glob("bot/api/**/*.{js,ts}")).map((filepath) =>
      path.resolve(filepath)
    );

    this.app.use(
      cors({
        origin: "*",
      })
    );
    this.app.use(express.json());

    this.app.listen(this.lynxPort, () => {
      console.info(`Lynx API is running on port ${this.lynxPort}`);
    });

    const apiDir = path.resolve("bot/api");

    for (const file of files) {
      try {
        const { default: APIClass } = await import(pathToFileURL(file).href);
        const api: API = new APIClass(this.client);
        // Calculate autoRoute from file path
        const relativePath = path.relative(apiDir, file);
        let autoRoute =
          "/" + relativePath.replace(/\\/g, "/").replace(/\.[jt]s$/, "");
        if (autoRoute.endsWith("/index")) {
          autoRoute = autoRoute.slice(0, -6) || "/";
        }

        const finalRoute = api.route || autoRoute;

        this.client.apis.set(finalRoute, api as API);
        if (!api.enabled) continue;

        console.info(`Loaded API: ${finalRoute}`);

        this.app.get(finalRoute, api.GET.bind(api));
        this.app.post(finalRoute, api.POST.bind(api));
        this.app.put(finalRoute, api.PUT.bind(api));
        this.app.delete(finalRoute, api.DELETE.bind(api));
        this.app.patch(finalRoute, api.PATCH.bind(api));
      } catch (err) {
        console.error(`Error loading ${file}: ${err}`);
      }
    }

    this.client.areAPILoaded = true;
    console.info("All APIs loaded");
  }
}

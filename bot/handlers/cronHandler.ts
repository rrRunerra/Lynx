import { glob } from "glob";
import { LynxClient } from "../client/client";
import path from "path";
import { pathToFileURL } from "url";
import { Cron } from "../structures/Cron";

export class CronHandler {
  public client: LynxClient;

  constructor(client: LynxClient) {
    this.client = client;
  }

  public async runCrons() {
    const files = (await glob("bot/crons/**/*.{js,ts}")).map((filepath) =>
      path.resolve(filepath)
    );

    files.map(async (file: string) => {
      const { default: CronClass } = await import(pathToFileURL(file).href);
      const cron: Cron = new CronClass(this.client);
      this.client.crons.set(cron.name, cron as Cron);

      if (!cron.name) {
        console.error(
          `Cron: ${file.split(path.sep).pop()} does not have a name`
        );
        return;
      }

      if (!cron.repeatTime) {
        console.error(
          `Cron: ${file.split(path.sep).pop()} does not have a repeat time)`
        );
        return;
      }

      if (!cron.excludeRunOnStart) {
        await cron.cronExecute();
      }

      console.info(`Loaded cron: ${cron.name}`, cron.name);

      setInterval((a) => {
        console.info(`Running cron: ${cron.name}`, cron.name);
        cron.cronExecute();
      }, cron.repeatTime);
    });
    this.client.areCronsLoaded = true;
    console.info("All crons loaded");
  }
}

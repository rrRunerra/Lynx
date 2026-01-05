import { Request, Response } from "express";
import { LynxClient } from "../../client/client";
import { API } from "../../structures/Api";
import { Cron } from "../../structures/Cron";

export default class ListCronsApi extends API {
  public client: LynxClient;

  constructor(client: LynxClient) {
    super({
      enabled: true,
      docs: "List all crons",
    });
    this.client = client;
  }

  public GET = (req: Request, res: Response) => {
    const crons = this.client.crons.map((cron: Cron) => {
      return {
        name: cron.name,
        enabled: cron.enabled,
        description: cron.description,
        repeatTime: cron.repeatTime,
        excludeOnStar: cron.excludeRunOnStart,
        docs: cron.docs,
      };
    });

    if (crons.length <= 0)
      return res.status(404).json({ error: "No crons found" });

    return res.json(crons);
  };
}

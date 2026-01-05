import { Request, Response } from "express";
import { LynxClient } from "../../client/client";
import { API } from "../../structures/Api";

export default class GetCronApi extends API {
  public client: LynxClient;

  constructor(client: LynxClient) {
    super({
      enabled: true,
      route: "/crons/getCron/:name",
      docs: "Get an cron information",
    });
    this.client = client;
  }

  public GET = (req: Request, res: Response) => {
    const cron = this.client.crons.get(req.params.name);
    if (!cron) return res.status(404).json({ error: "Cron not found" });
    return res.json({
      name: cron.name,
      enabled: cron.enabled,
      description: cron.description,
      docs: cron.docs,
    });
  };
}

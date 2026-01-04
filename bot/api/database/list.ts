import { LynxClient } from "@/bot/client/client";
import { API } from "@/bot/structures/Api";
import { Request, Response } from "express";
export default class ListDatabasesApi extends API {
  public client: LynxClient;

  constructor(client: LynxClient) {
    super({
      enabled: true,
    });
    this.client = client;
  }

  public GET = (req: Request, res: Response) => {
    const databases = Object.keys(this.client.prisma).filter(
      (key) =>
        !key.startsWith("$") && !key.startsWith("_") && key != "constructor"
    );
    return res.json(databases);
  };
}

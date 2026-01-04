import { Request, Response } from "express";
import { LynxClient } from "../client/client";
import { API } from "../structures/Api";

export default class TestApi extends API {
  public client: LynxClient;

  constructor(client: LynxClient) {
    super({
      enabled: true,
    });
    this.client = client;
  }

  public GET = (req: Request, res: Response) => {
    return res.json({ message: "Hello World" });
  };
}

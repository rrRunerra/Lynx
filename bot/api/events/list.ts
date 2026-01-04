import { Request, Response } from "express";
import { LynxClient } from "../../client/client";
import { API } from "../../structures/Api";
import { Event } from "@/bot/structures/Event";

export default class ListEventsApi extends API {
  public client: LynxClient;

  constructor(client: LynxClient) {
    super({
      enabled: true,
    });
    this.client = client;
  }

  public GET = (req: Request, res: Response) => {
    const events = this.client.events.map((event: Event) => {
      return {
        name: event.name,
        enabled: event.enabled,
        description: event.description,
        type: event.type,
        once: event.once,
      };
    });

    if (events.length <= 0)
      return res.status(404).json({ error: "No events found" });

    return res.json(events);
  };
}

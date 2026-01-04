import { Request, Response } from "express";
import { LynxClient } from "../../client/client";
import { API } from "../../structures/Api";
import { Event } from "@/bot/structures/Event";

export default class GetEventApi extends API {
  public client: LynxClient;

  constructor(client: LynxClient) {
    super({
      enabled: true,
      route: "/events/getEvent/:name",
      docs: "Get an event information",
    });
    this.client = client;
  }

  public GET = (req: Request, res: Response) => {
    const event = this.client.events.get(req.params.name);
    if (!event) return res.status(404).json({ error: "Event not found" });
    return res.json({
      name: event.name,
      enabled: event.enabled,
      description: event.description,
      type: event.type,
      once: event.once,
      docs: event.docs,
    });
  };
}

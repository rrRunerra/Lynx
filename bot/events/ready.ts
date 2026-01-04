import { Events } from "discord.js";
import { LynxClient } from "../client/client";
import { Event } from "../structures/Event";

export default class ReadyEvent extends Event {
  constructor(client: LynxClient) {
    super(client, {
      name: "ReadyEvent",
      type: Events.ClientReady,
      once: true,
      enabled: true,
      description: "Ready event",
      docs: "Logs when the bot is online and ready.",
    });
  }

  public async eventExecute() {
    console.info(`${this.client.user?.username} is online`);
  }
}

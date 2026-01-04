import { Events } from "discord.js";
import { LynxClient } from "../client/client";

export class Event {
  public name: string;
  public type: Events;
  public once: boolean;
  public enabled: boolean;
  public description: string;
  public client: LynxClient;
  public docs: string;

  constructor(client: LynxClient, options: IEventOptions) {
    this.name = options.name;
    this.type = options.type;
    this.description = options.description;
    this.once = options.once;
    this.enabled = options.enabled;
    this.client = client;
    this.docs = options.docs;
  }

  public async eventExecute(...args: any): Promise<any> {}
}

export interface IEventOptions {
  name: string;
  type: Events;
  once: boolean;
  enabled: boolean;
  description: string;
  docs: string;
}

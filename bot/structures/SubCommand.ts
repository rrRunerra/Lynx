import { ChatInputCommandInteraction } from "discord.js";
import { LynxClient } from "../client/client";

export class SubCommand {
  public name: string;
  public enabled: boolean;
  public client: LynxClient;
  public docs: string;

  constructor(client: LynxClient, options: ISubCommandOptions) {
    this.name = options.name;
    this.enabled = options.enabled;
    this.client = client;
    this.docs = options.docs;
  }

  public async slashCommandExecute(
    interaction: ChatInputCommandInteraction
  ): Promise<any> {}
}

export interface ISubCommandOptions {
  name: string;
  enabled: boolean;
  docs: string;
}

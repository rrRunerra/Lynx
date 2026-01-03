import { ChatInputCommandInteraction } from "discord.js";
import { LynxClient } from "../client/client";

export class SubCommand {
  public name: string;
  public enabled: boolean;
  public client: LynxClient;

  constructor(client: LynxClient, options: ISubCommandOptions) {
    this.name = options.name;
    this.enabled = options.enabled;
    this.client = client;
  }

  public async slashCommandExecute(interaction: ChatInputCommandInteraction) {}
}

export interface ISubCommandOptions {
  name: string;
  enabled: boolean;
}

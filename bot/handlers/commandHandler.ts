import { LynxClient } from "../client/client";
import { glob } from "glob";
import path from "path";
import { Command } from "../structures/Command";
import { SubCommand } from "../structures/SubCommand";
import { pathToFileURL } from "url";

export class CommandHandler {
  public client: LynxClient;

  constructor(client: LynxClient) {
    this.client = client;
  }

  public async loadCommands() {
    const files = (await glob("bot/commands/**/*.{js,ts}")).map((filepath) =>
      path.resolve(filepath)
    );
    files.map(async (file: string) => {
      const { default: CommandClass } = await import(pathToFileURL(file).href);
      const isSubCommand = file.split("/").pop()?.split(".")[2] !== undefined;

      if (isSubCommand) {
        const command: SubCommand = new CommandClass();
        this.client.subCommands.set(command.name, command as SubCommand);
        return;
      }

      const command: Command = new CommandClass();

      if (!command.enabled) return;

      if (!command.name) {
        console.error(
          `Command: ${file.split(path.sep).pop()} does not have a name`
        );
        return;
      }
      // push owner and dev server just to be sure
      command.userOnly.push(process.env.LYNX_OWNER!);
      command.serverOnly.push(process.env.DEV_SERVER!);

      if (file.split("/").pop()?.split(".")[2] !== undefined) {
        this.client.subCommands.set(command.name, command as SubCommand);
      } else {
        this.client.commands.set(command.name, command as Command);
      }
      console.info(`Loaded command: ${command.name}`);
    });
    console.log("All commands loaded");
    this.client.areCommandsLoaded = true;
  }
}

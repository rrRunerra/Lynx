import { Client, Collection, GatewayIntentBits, Partials } from "discord.js";
import prisma from "../../lib/prisma";
import { Command } from "../structures/Command";
import { SubCommand } from "../structures/SubCommand";
import { Cron } from "../structures/Cron";
import { Event } from "../structures/Event";
import { CommandHandler } from "../handlers/commandHandler";
import { EventHandler } from "../handlers/eventHandler";
import { CronHandler } from "../handlers/cronHandler";
import "dotenv/config";

export class LynxClient extends Client {
  public mode: "development" | "production";
  public prisma = prisma;
  public owner: string = process.env.LYNX_OWNER!;

  public commands: Collection<string, Command>;
  public subCommands: Collection<string, SubCommand>;
  public crons: Collection<string, Cron>;
  public events: Collection<string, Event>;
  public cooldowns: Collection<string, Collection<string, number>>;

  public commandHandler: CommandHandler;
  public eventHandler: EventHandler;
  public cronHandler: CronHandler;

  public areCommandsLoaded: Boolean = false;
  public areEventsLoaded: Boolean = false;
  public areCronsLoaded: Boolean = false;

  public constructor() {
    super({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.DirectMessageTyping,
        GatewayIntentBits.GuildPresences,
      ],
      partials: [Partials.Channel, Partials.Message, Partials.GuildMember],
    });

    this.mode = process.argv.slice(2).includes("--dev")
      ? "development"
      : "production";

    this.commands = new Collection();
    this.subCommands = new Collection();
    this.cooldowns = new Collection();
    this.crons = new Collection();
    this.events = new Collection();

    this.commandHandler = new CommandHandler(this);
    this.eventHandler = new EventHandler(this);
    this.cronHandler = new CronHandler(this);

    this.commandHandler.loadCommands();
    this.eventHandler.loadEvents();
    this.cronHandler.runCrons();
  }

  public override async login() {
    let token: string;
    switch (this.mode) {
      case "development": {
        token = process.env.DEV_LYNX_TOKEN!;
        break;
      }
      case "production": {
        token = process.env.PROD_LYNX_TOKEN!;
        break;
      }
      default: {
        throw new Error("Invalid mode");
      }
    }

    if (!token) throw new Error("No token provided");

    return super.login(token);
  }
}

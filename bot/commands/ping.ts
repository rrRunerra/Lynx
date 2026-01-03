import {
  ApplicationCommandOptionType,
  ChatInputCommandInteraction,
  MessageFlags,
  PermissionFlagsBits,
} from "discord.js";
import { Command } from "../structures/Command";
import { client } from "../index";

export default class PingCommand extends Command {
  constructor() {
    super({
      name: "ping",
      description: "Ping the bot",
      category: "Misc",
      cooldown: 500,
      nsfw: false,
      clientPermissions: [],
      userPermissions: ["AttachFiles"],
      dev: client.mode,
      enabled: true,
      cooldownFilteredUsers: [],
      serverOnly: [],
      userOnly: [],
      options: [],
      allowDm: true,
    });
  }

  async slashCommandExecute(interaction: ChatInputCommandInteraction) {
    await interaction.reply({
      content: "Pong! from Atlas",
      flags: MessageFlags.Ephemeral,
    });
  }
}

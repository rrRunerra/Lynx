import { client } from "../../index";
import { Command } from "../../structures/Command";
import {
  ApplicationCommandOptionType,
  ChatInputCommandInteraction,
  EmbedBuilder,
} from "discord.js";
import "dotenv/config";
import crypto from "crypto";

export default class AuthCommand extends Command {
  constructor() {
    super({
      name: "auth",
      description: "Links the bot to the web account using an API Key.",
      category: "Web",
      cooldown: 60,
      nsfw: false,
      clientPermissions: ["SendMessages", "EmbedLinks"],
      userPermissions: ["SendMessages", "UseApplicationCommands"],
      dev: client.mode,
      enabled: true,
      cooldownFilteredUsers: [],
      serverOnly: [],
      userOnly: [process.env.LYNX_OWNER!],
      options: [
        {
          name: "api",
          description: "Your API Key created in the dashboard.",
          type: ApplicationCommandOptionType.String,
          required: true,
        },
        {
          name: "lynxkey",
          description: "Key that is in env under rrLynxKey",
          type: ApplicationCommandOptionType.String,
          required: true,
        },
      ],
      allowDm: true,
      docs: "Links the bot to the web account using an API Key.",
    });
  }

  public async slashCommandExecute(interaction: ChatInputCommandInteraction) {
    await interaction.deferReply({ ephemeral: true });

    const rawKey = interaction.options.getString("api", true);
    const lynxKey = interaction.options.getString("lynxkey", true);

    if (lynxKey !== process.env.rrLynxKey) {
      await interaction.editReply({
        content: "Invalid Lynx Key. Please try again.",
      });
      return;
    }

    // Hash the key to find it in DB
    const keyHash = crypto.createHash("sha256").update(rawKey).digest("hex");

    try {
      const apiKey = await this.client.prisma.apiKey.findUnique({
        where: { keyHash },
        include: { user: true },
      });

      if (!apiKey) {
        await interaction.editReply({
          content:
            "Invalid API Key. Please create one in the dashboard and try again.",
        });
        return;
      }

      // Update the user's lynxKey to "linked" status
      await this.client.prisma.user.update({
        where: { id: apiKey.userId },
        data: { lynxKey: "linked", discordUserId: interaction.user.id },
      });

      const embed = new EmbedBuilder()
        .setColor("Green")
        .setTitle("Authentication Successful")
        .setDescription(
          `Successfully linked Discord to web account for **${apiKey.user.username}**.\nYou can now access restricted features.`
        )
        .setFooter({ text: "Lynx Security System" })
        .setTimestamp();

      await interaction.editReply({ embeds: [embed] });
    } catch (error) {
      console.error("Auth command error:", error);
      await interaction.editReply({
        content: "An error occurred while processing your request.",
      });
    }
  }
}

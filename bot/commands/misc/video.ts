import { Command } from "../../structures/Command";
import { client } from "../../index";
import {
  ApplicationCommandOptionType,
  ChatInputCommandInteraction,
} from "discord.js";
import fs from "fs";
import ytdlp from "yt-dlp-exec";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default class VideoCommand extends Command {
  constructor() {
    super({
      name: "video",
      description: "Sends a Video from tiktok, instagram.",
      category: "Misc",
      allowDm: true,
      clientPermissions: ["SendMessages", "AttachFiles"],
      cooldown: 30,
      cooldownFilteredUsers: [],
      userOnly: [],
      dev: client.mode,
      enabled: true,
      nsfw: false,
      serverOnly: [],
      userPermissions: ["SendMessages", "AttachFiles"],
      options: [
        {
          name: "url",
          description: "Video url",
          type: ApplicationCommandOptionType.String,
          required: true,
        },
      ],
      docs: "Downloads and sends requested video from tiktok, youtube or instagram.",
    });
  }

  public async slashCommandExecute(interaction: ChatInputCommandInteraction) {
    const url = interaction.options.getString("url")!;
    await interaction.deferReply();

    const createdFiles: string[] = [];
    const folder = path.join(process.cwd(), "video_cache");

    try {
      console.info(`Fetching metadata for: ${url}`);

      const metadata: any = await ytdlp(url, {
        dumpSingleJson: true,
        noWarnings: true,
        // We allow playlist data to inspect it
      });

      const isPlaylist =
        metadata._type === "playlist" || Array.isArray(metadata.entries);
      const entries = isPlaylist ? metadata.entries : [metadata];

      // Basic count check
      const count = entries.length;
      console.info(`Detected ${count} item(s) (Playlist: ${isPlaylist})`);

      // Prepare Directory
      try {
        fs.mkdirSync(folder, { recursive: true });
        if (!fs.existsSync(folder))
          throw new Error(`Failed to create: ${folder}`);
      } catch (dirErr) {
        console.error(`Directory error: ${dirErr}`);
        await interaction.editReply("Could not create download directory.");
        return;
      }

      const uniqueId = `${Date.now()}_${interaction.id}`;

      if (isPlaylist) {
        // Handle Playlist / Gallery
        const OutputTemplate = `media_${uniqueId}_%(autonumber)s.%(ext)s`;
        const outputPath = path.join(folder, OutputTemplate);

        console.info(`Downloading playlist to: ${outputPath}`);

        await ytdlp(url, {
          output: outputPath,
          noWarnings: true,
          restrictFilenames: true,
          maxDownloads: 10, // Discord limit per message
          maxFilesize: "10M",
        });
      } else {
        // Handle Single File
        const ext = metadata.ext || "mp4";
        const outputFileName = `media_${uniqueId}.${ext}`;
        const outputPath = path.join(folder, outputFileName);

        console.info(`Downloading single file to: ${outputPath}`);

        await ytdlp(url, {
          output: outputPath,
          noWarnings: true,
          restrictFilenames: true,
          noPlaylist: true,
          maxFilesize: "10M",
        });
      }

      // Find all matching files
      const allFiles = fs.readdirSync(folder);
      const matchingFiles = allFiles
        .filter((f) => f.startsWith(`media_${uniqueId}`))
        .map((f) => path.join(folder, f));

      if (matchingFiles.length === 0) {
        throw new Error("Download failed - no files found.");
      }

      // Check sizes
      for (const file of matchingFiles) {
        const stats = fs.statSync(file);
        if (stats.size === 0)
          throw new Error(`File ${path.basename(file)} is empty`);
        createdFiles.push(file);
      }

      // Upload to Discord
      // Discord allows max 10 files. We already limited safe-guards in ytdlp,
      // but let's slice just in case.
      const filesToSend = createdFiles.slice(0, 10).map((file) => ({
        attachment: file,
        name: path.basename(file),
      }));

      // Determine content type for message
      const extensions = createdFiles.map((f) =>
        path.extname(f).toLowerCase().replace(".", "")
      );
      const allImages = extensions.every((ext) =>
        ["jpg", "jpeg", "png", "webp", "gif"].includes(ext)
      );
      const allVideos = extensions.every((ext) =>
        ["mp4", "webm", "mkv", "mov", "avi"].includes(ext)
      );

      let contentTypeLabel = "content 📦";
      if (allImages)
        contentTypeLabel = `image${createdFiles.length > 1 ? "s" : ""} 🖼️`;
      else if (allVideos)
        contentTypeLabel = `video${createdFiles.length > 1 ? "s" : ""} 🎬`;

      await interaction.editReply({
        content: `Here’s your ${contentTypeLabel}`,
        files: filesToSend,
      });
    } catch (err: any) {
      console.error(`Process failed: ${err}`);
      await interaction.editReply(
        `Failed. Either the link contains no video or it is invalid. ${url}`
      );
    } finally {
      // Cleanup all files
      for (const file of createdFiles) {
        if (fs.existsSync(file)) {
          try {
            fs.unlinkSync(file);
          } catch (cleanupErr) {
            console.error(`Cleanup failed for ${file}: ${cleanupErr}`);
          }
        }
      }
    }
  }
}

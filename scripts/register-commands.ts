import "dotenv/config";
import discordApi from "@/lib/discordApi";
import { commands } from "@/commands";
import { validateEnv } from "@/lib/env";

validateEnv();

const CLIENT_ID = process.env.DISCORD_CLIENT_ID;
const GUILD_ID = process.env.GUILD_ID;

async function registerCommands() {
  try {
    const commandDefinitions = commands.map(cmd => cmd.data);

    console.log(
      `Found ${commandDefinitions.length} commands to register:`,
      commandDefinitions.map(cmd => cmd.name)
    );

    console.log("Registering commands to guild...");

    const result = await discordApi.applicationCommands.bulkOverwriteGuildCommands(
      CLIENT_ID,
      GUILD_ID,
      commandDefinitions
    );

    console.log(`✅ Successfully registered ${result.length} commands!`);
  } catch (error) {
    console.error("❌ Failed to register commands:", error.message);
    process.exit(1);
  }
}

registerCommands();

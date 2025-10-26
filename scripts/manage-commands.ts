import "dotenv/config";
import type { APIApplicationCommandOption } from "@discordjs/core/http-only";
import discordApi from "@/lib/discordApi";
import { validateEnv } from "@/lib/env";

validateEnv();

const CLIENT_ID = process.env.DISCORD_CLIENT_ID;
const GUILD_ID = process.env.GUILD_ID;

async function listRegisteredCommands() {
  try {
    const registeredCommands = await discordApi.applicationCommands.getGuildCommands(CLIENT_ID, GUILD_ID);

    console.log(`\n📋 Registered Guild Commands (${registeredCommands.length}):`);
    registeredCommands.forEach(cmd => {
      console.log(`  • /${cmd.name} - ${cmd.description}`);
      if (cmd.options && cmd.options.length > 0) {
        cmd.options.forEach((opt: APIApplicationCommandOption) => {
          const required = opt.required ? " (required)" : "";
          console.log(`    - ${opt.name}${required}: ${opt.description}`);
        });
      }
    });
  } catch (error) {
    console.error("❌ Failed to list commands:", error.message);
  }
}

async function clearAllCommands() {
  try {
    await discordApi.applicationCommands.bulkOverwriteGuildCommands(CLIENT_ID, GUILD_ID, []);

    console.log(`✅ Cleared all guild commands`);
  } catch (error) {
    console.error("❌ Failed to clear commands:", error.message);
  }
}

const command: string | undefined = process.argv[2];

switch (command) {
  case "list":
  case "ls":
    await listRegisteredCommands();
    break;
  case "clear":
    await clearAllCommands();
    break;
  default:
    console.log(`
Discord Command Manager

Usage: tsx scripts/manage-commands.js <command>

Commands:
  list, ls     - List registered guild commands
  clear        - Clear all registered guild commands
`);
}

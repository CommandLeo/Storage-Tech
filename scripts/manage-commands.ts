import "dotenv/config";
import { parseArgs } from "node:util";
import type { APIApplicationCommandOption } from "@discordjs/core/http-only";
import { validateEnv } from "@/lib/env";
import discordApi from "@/lib/discordApi";
import { commands } from "@/interactions/commands";

validateEnv();

const CLIENT_ID = process.env.DISCORD_CLIENT_ID!;
const GUILD_ID = process.env.GUILD_ID!;

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

const { values, positionals } = parseArgs({
  options: {
    help: { type: "boolean", short: "h" },
  },
  allowPositionals: true,
});

const command = positionals[0];

if (values.help || !command) {
  console.log(`
Discord Command Manager

Usage: tsx scripts/manage-commands.ts <command> [options]

Commands:
  register, reg  - Register local commands to the guild
  list, ls       - List registered guild commands
  clear          - Clear all registered guild commands

Options:
  -h, --help     - Show this help message
`);
  process.exit(0);
}

switch (command) {
  case "register":
  case "reg":
    await registerCommands();
    break;
  case "list":
  case "ls":
    await listRegisteredCommands();
    break;
  case "clear":
    await clearAllCommands();
    break;
  default:
    console.error(`❌ Unknown command: ${command}`);
    console.log("Run with --help to see available commands.");
    process.exit(1);
}

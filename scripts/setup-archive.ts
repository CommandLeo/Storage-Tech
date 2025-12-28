import "dotenv/config";
import { parseArgs } from "node:util";
import { setupArchive, setupChannel } from "@/lib/setupArchive";
import { validateEnv } from "@/lib/env";
import { validateConfig } from "@/lib/config";

validateEnv();
validateConfig();

const { values, positionals } = parseArgs({
  options: {
    force: { type: "boolean", short: "f" },
    help: { type: "boolean", short: "h" },
  },
  allowPositionals: true,
});

if (values.help) {
  console.log(`
Archive Setup Utility

Usage: tsx scripts/setup-archive.ts [channelName] [options]

Arguments:
  channelName    - Optional: Setup a specific channel by name

Options:
  -f, --force    - Force update existing channels/categories
  -h, --help     - Show this help message
`);
  process.exit(0);
}

const force = !!values.force;
const channelName = positionals[0];

try {
  if (channelName) {
    console.log(`Setting up specific channel: ${channelName}${force ? " (force mode)" : ""}`);
    await setupChannel(channelName, force);
  } else {
    console.log(`Starting archive setup${force ? " with force mode (will update existing channels)" : ""}`);
    await setupArchive(force);
  }
} catch (error) {
  const message = error instanceof Error ? error.message : String(error);
  console.error("Error during archive setup:", message);
}

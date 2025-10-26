import "dotenv/config";
import { setupArchive, setupChannel } from "@/lib/setupArchive";
import { validateEnv } from "@/lib/env";
import { validateConfig } from "@/lib/config";

validateEnv();
validateConfig();

const args = process.argv.slice(2);
const force = args.includes("--force") || args.includes("-f");

const channelName = args.find(arg => !arg.startsWith("--") && !arg.startsWith("-"));

try {
  if (channelName) {
    console.log(`Setting up specific channel: ${channelName}${force ? " (force mode)" : ""}`);
    await setupChannel(channelName, force);
  } else if (force) {
    console.log("Starting archive setup with force mode (will update existing channels)...");
    await setupArchive(force);
  } else {
    console.log("Starting archive setup");
    await setupArchive(force);
  }
} catch (error) {
  console.error("Error during archive setup:", error.message);
}

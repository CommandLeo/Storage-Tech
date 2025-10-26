import { z } from "zod";
import config from "../config.json";

const channelSchema = z.object({
  name: z.string().min(1, "Channel name is required"),
  display_name: z.string().min(1, "Channel display name is required"),
  tags: z
    .array(z.string().max(20, "Tag cannot be longer than 20 characters"))
    .max(20, "No more than 20 tags are allowed"),
});

export const configSchema = z.object({
  rolesWhitelist: z.array(z.string().min(1)).min(1, "At least one whitelisted role is required"),

  logChannel: z.string().min(1, "Log channel name is required"),

  defaultEmoji: z.string().min(1, "Default emoji is required"),

  channels: z.record(
    z.string().min(1, "Category name is required"),
    z.array(channelSchema).min(1, "At least one channel configuration is required per category")
  ),

  discordServers: z.record(z.string(), z.url("Discord server invite must be a valid URL")),
});

export function validateConfig() {
  try {
    return configSchema.parse(config);
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.log(` ❌ Configuration validation failed\n`);

      error.issues.forEach(err => {
        console.error(`   - ${err.path.join(".")}: ${err.message}`);
      });
    } else {
      console.error(` ❌ Unexpected error during configuration validation:`, error.message);
    }

    console.log();
    process.exit(1);
  }
}

export type Config = z.infer<typeof configSchema>;
export default config;

import { z } from "zod";

export const envSchema = z.object({
  GUILD_ID: z.string().describe("The ID of the discord guild"),

  DISCORD_BOT_TOKEN: z
    .string()
    .min(60, "DISCORD_BOT_TOKEN is required")
    .describe("Discord bot token for API authentication"),

  DISCORD_CLIENT_ID: z.string().min(16, "DISCORD_CLIENT_ID is required").describe("Discord application client ID"),

  DISCORD_CLIENT_SECRET: z
    .string()
    .min(32, "DISCORD_CLIENT_SECRET is required")
    .describe("Discord application client secret"),

  DISCORD_PUBLIC_KEY: z
    .string()
    .min(64, "DISCORD_PUBLIC_KEY is required")
    .describe("Discord application public key for verifying interactions"),

  AUTH_SECRET: z
    .string()
    .min(32, "AUTH_SECRET must be at least 32 characters long")
    .describe("Secret key for NextAuth.js session encryption"),
});

export function validateEnv() {
  try {
    return envSchema.parse(process.env);
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.log(` ❌ Environment variables validation failed\n`);

      error.issues.forEach(err => {
        console.error(`   - ${err.path.join(".")}: ${err.message}`);
      });
    } else {
      console.error(` ❌ Unexpected error during environment validation:`, error.message);
    }

    console.log();
    process.exit(1);
  }
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace NodeJS {
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    interface ProcessEnv extends z.infer<typeof envSchema> {}
  }
}

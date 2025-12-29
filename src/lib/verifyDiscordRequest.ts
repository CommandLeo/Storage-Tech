import type { APIInteraction } from "@discordjs/core/http-only";
import { verifyKey } from "discord-interactions";

const DISCORD_PUBLIC_KEY = process.env.DISCORD_PUBLIC_KEY;

export default async function verifyDiscordRequest(request: Request) {
  const signature = request.headers.get("x-signature-ed25519");
  const timestamp = request.headers.get("x-signature-timestamp");
  const body = await request.text();

  const isValidRequest = signature && timestamp && (await verifyKey(body, signature, timestamp, DISCORD_PUBLIC_KEY));
  if (!isValidRequest) {
    return { isValid: false };
  }

  const interaction: APIInteraction = JSON.parse(body);
  return { interaction, isValid: true };
}

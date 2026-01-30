import "dotenv/config";
import { parseArgs } from "node:util";
import fs from "node:fs";
import path from "node:path";
import { ButtonStyle, ComponentType } from "@discordjs/core/http-only";
import { roleMention } from "@discordjs/formatters";
import { validateEnv } from "@/lib/env";
import discordApi from "@/lib/discordApi";
import { getRoleIdByName } from "@/lib/discordUtils";

const ticketMessageText = fs.readFileSync(path.resolve(import.meta.dirname, "assets", "support-tickets.txt"), "utf8");

validateEnv();

async function sendTicketsMessage(channel_id: string) {
  const staffRoleId = await getRoleIdByName("Staff");
  const embedText = staffRoleId ? ticketMessageText.replaceAll("@Staff", roleMention(staffRoleId)) : ticketMessageText;

  return await discordApi.channels.createMessage(channel_id, {
    embeds: [
      {
        title: "Support Tickets",
        description: embedText,
        color: 0x3498db,
      },
    ],
    components: [
      {
        type: ComponentType.ActionRow,
        components: [
          {
            type: ComponentType.Button,
            style: ButtonStyle.Primary,
            label: "Create ticket",
            custom_id: "create-ticket-button",
            emoji: { name: "🎫" },
          },
        ],
      },
    ],
  });
}

const { positionals } = parseArgs({ allowPositionals: true });

if (positionals.length > 0) {
  const [channel] = positionals;
  await sendTicketsMessage(channel);
  process.exit(0);
} else {
  console.error("Error: channel_id positional argument is required");
  console.error("Usage: tsx send-tickets-message.ts <channel_id>");
  process.exit(1);
}

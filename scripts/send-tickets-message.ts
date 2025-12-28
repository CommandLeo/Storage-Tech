import "dotenv/config";
import { parseArgs } from "node:util";
import { validateEnv } from "@/lib/env";
import discordApi from "@/lib/discordApi";
import { ButtonStyle, ComponentType, MessageFlags } from "@discordjs/core/http-only";

validateEnv();

async function sendTicketsMessage(channel_id: string) {
  await discordApi.channels.createMessage(channel_id, {
    components: [
      {
        type: ComponentType.TextDisplay,
        content: "Click the button to open a ticket",
      },
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
    flags: MessageFlags.IsComponentsV2,
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

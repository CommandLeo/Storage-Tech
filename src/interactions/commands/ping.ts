import { InteractionResponseType } from "@discordjs/core/http-only";
import { Command } from "@/types";

const command: Command = {
  data: {
    name: "ping",
    description: "Replies with Pong! and shows bot latency",
  },

  async execute(interaction) {
    const timestamp = Date.now();
    const interactionTimestamp = Number((BigInt(interaction.id) >> BigInt(22)) + BigInt(1420070400000));
    const latency = timestamp - interactionTimestamp;

    return {
      type: InteractionResponseType.ChannelMessageWithSource,
      data: {
        content: `🏓 Pong! Latency: ${latency}ms`,
      },
    };
  },
};

export default command;

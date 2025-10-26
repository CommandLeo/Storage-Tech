import {
  InteractionResponseType,
  type APIInteractionResponse,
  type APIApplicationCommandInteraction,
  type RESTPostAPIChatInputApplicationCommandsJSONBody,
} from "@discordjs/core/http-only";

interface Command {
  data: RESTPostAPIChatInputApplicationCommandsJSONBody;
  execute: (interaction: APIApplicationCommandInteraction) => Promise<APIInteractionResponse>;
}

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

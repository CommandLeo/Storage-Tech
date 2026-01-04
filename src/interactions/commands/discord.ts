import {
  ApplicationCommandOptionType,
  InteractionResponseType,
  MessageFlags,
  type APIApplicationCommandInteractionDataStringOption,
  type APIChatInputApplicationCommandInteractionData,
} from "@discordjs/core/http-only";
import config from "@/lib/config";
import { Command } from "@/types";

const discordServers = config.discordServers;

const command: Command = {
  data: {
    name: "discord",
    description: "Returns the invite link of the specified discord server",
    options: [
      {
        name: "server",
        description: "Name of the discord server of which to get the invite",
        type: ApplicationCommandOptionType.String,
        required: false,
        choices: Object.keys(discordServers).map(name => ({ name, value: name })),
      },
    ],
  },

  async execute(interaction) {
    const data = interaction.data as APIChatInputApplicationCommandInteractionData;
    const serverOption = data.options?.[0] as APIApplicationCommandInteractionDataStringOption;
    const inputServerName = serverOption?.value ?? "Storage Tech";
    const entry = Object.entries(discordServers).find(([key]) => key.toLowerCase() === inputServerName.toLowerCase());

    if (!entry) {
      return {
        type: InteractionResponseType.ChannelMessageWithSource,
        data: {
          flags: MessageFlags.Ephemeral,
          content: `Server "${inputServerName}" not found`,
        },
      };
    }

    const [serverName, discordInvite] = entry;

    return {
      type: InteractionResponseType.ChannelMessageWithSource,
      data: {
        content: discordInvite ?? `No invite found for "${serverName}".`,
      },
    };
  },
};

export default command;

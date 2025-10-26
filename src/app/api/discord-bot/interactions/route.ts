import type { NextRequest } from "next/server";
import { InteractionResponseType, InteractionType, MessageFlags } from "@discordjs/core/http-only";
import { commands } from "@/commands";
import verifyDiscordRequest from "@/lib/verifyDiscordRequest";

export async function POST(request: NextRequest) {
  const { isValid, interaction } = await verifyDiscordRequest(request);
  if (!isValid || !interaction) {
    return Response.json({ error: "Bad request signature." }, { status: 401 });
  }

  if (interaction.type === InteractionType.Ping) {
    return Response.json({
      type: InteractionResponseType.Pong,
    });
  }

  if (interaction.type === InteractionType.ApplicationCommand) {
    try {
      const commandName = interaction.data?.name?.toLowerCase();
      if (!commandName) {
        return Response.json({
          type: InteractionResponseType.ChannelMessageWithSource,
          data: {
            content: "Invalid command data!",
            flags: MessageFlags.Ephemeral,
          },
        });
      }

      const command = commands.find(cmd => cmd.data.name.toLowerCase() === commandName);

      if (!command) {
        return Response.json({
          type: InteractionResponseType.ChannelMessageWithSource,
          data: {
            content: "Command not found!",
            flags: MessageFlags.Ephemeral,
          },
        });
      }

      const response = await command.execute(interaction);
      return Response.json(response);
    } catch (error) {
      console.error("Error executing command:", error.message);
      const errorMessage =
        process.env.NODE_ENV === "development"
          ? `There was an error executing this command: ${error.message}`
          : "There was an error executing this command!";
      return Response.json({
        type: InteractionResponseType.ChannelMessageWithSource,
        data: {
          content: errorMessage,
          flags: MessageFlags.Ephemeral,
        },
      });
    }
  }

  console.error("Unknown interaction type:", interaction.type);
  return Response.json({ error: "Unknown interaction type" }, { status: 400 });
}

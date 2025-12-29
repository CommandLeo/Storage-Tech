import { type NextRequest } from "next/server";
import {
  type APIApplicationCommandAutocompleteInteraction,
  type APIApplicationCommandInteraction,
  type APIMessageComponentInteraction,
  type APIModalSubmitInteraction,
  InteractionResponseType,
  InteractionType,
  MessageFlags,
} from "@discordjs/core/http-only";

// Force dynamic rendering to prevent Next.js from statically analyzing Discord imports during build
// This avoids network calls to discord.com when the discord-interactions package is loaded
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// Lazy load dependencies to prevent module-level execution during build time
// The discord-interactions package makes network requests on import, which causes build failures
const getVerifyDiscordRequest = async () => {
  const mod = await import("@/lib/verifyDiscordRequest");
  return mod.default;
};

const getCommands = async () => {
  const mod = await import("@/interactions/commands");
  return mod.commands;
};

const getMessageComponents = async () => {
  const mod = await import("@/interactions/message-components");
  return mod.messageComponents;
};

const getModals = async () => {
  const mod = await import("@/interactions/modals");
  return mod.modals;
};

async function handleApplicationCommandInteraction(interaction: APIApplicationCommandInteraction) {
  try {
    const commands = await getCommands();
    const commandName = interaction.data?.name?.toLowerCase();
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

    if (response === null) return new Response(null, { status: 202 });

    return Response.json(response);
  } catch (error) {
    console.error("Error executing command:", error.message);
    const errorMessage =
      process.env.NODE_ENV === "development"
        ? `There was an error executing this command: \`${error.message}\``
        : "There was an error executing this command!";

    return Response.json(
      {
        type: InteractionResponseType.ChannelMessageWithSource,
        data: {
          content: errorMessage,
          flags: MessageFlags.Ephemeral,
        },
      },
      { status: 500 }
    );
  }
}

async function handleMessageComponentInteraction(interaction: APIMessageComponentInteraction) {
  try {
    const messageComponents = await getMessageComponents();
    const customId = interaction.data.custom_id;
    const component = messageComponents.find(comp => comp.custom_id === customId);

    if (!component) {
      return Response.json({
        type: InteractionResponseType.ChannelMessageWithSource,
        data: {
          content: "Component not found!",
          flags: MessageFlags.Ephemeral,
        },
      });
    }

    const response = await component.execute(interaction);

    if (response === null) return new Response(null, { status: 202 });

    return Response.json(response);
  } catch (error) {
    console.error("Error executing message component:", error.message);
    const errorMessage =
      process.env.NODE_ENV === "development"
        ? `There was an error executing this component: \`${error.message}\``
        : "There was an error executing this component!";

    return Response.json(
      {
        type: InteractionResponseType.ChannelMessageWithSource,
        data: {
          content: errorMessage,
          flags: MessageFlags.Ephemeral,
        },
      },
      { status: 500 }
    );
  }
}

async function handleApplicationCommandAutocompleteInteraction(
  interaction: APIApplicationCommandAutocompleteInteraction
) {
  try {
    const commands = await getCommands();
    const commandName = interaction.data?.name?.toLowerCase();
    const command = commands.find(cmd => cmd.data.name.toLowerCase() === commandName);

    if (!command || !command.autocomplete) {
      return Response.json({ choices: [] });
    }

    const response = await command.autocomplete(interaction);

    if (response === null) return new Response(null, { status: 202 });

    return Response.json(response);
  } catch (error) {
    console.error("Error executing autocomplete:", error.message);
    return Response.json({ choices: [] }, { status: 500 });
  }
}

async function handleModalSubmitInteraction(interaction: APIModalSubmitInteraction) {
  try {
    const modals = await getModals();
    const customId = interaction.data.custom_id;
    const modal = modals.find(m => m.custom_id === customId);

    if (!modal) {
      return Response.json({
        type: InteractionResponseType.ChannelMessageWithSource,
        data: {
          content: "Modal not found!",
          flags: MessageFlags.Ephemeral,
        },
      });
    }

    const response = await modal.execute(interaction);

    if (response === null) return new Response(null, { status: 202 });

    return Response.json(response);
  } catch (error) {
    console.error("Error executing modal submit:", error.message);
    const errorMessage =
      process.env.NODE_ENV === "development"
        ? `There was an error executing this modal: \`${error.message}\``
        : "There was an error executing this modal!";

    return Response.json(
      {
        type: InteractionResponseType.ChannelMessageWithSource,
        data: {
          content: errorMessage,
          flags: MessageFlags.Ephemeral,
        },
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const verifyDiscordRequest = await getVerifyDiscordRequest();
  const { isValid, interaction } = await verifyDiscordRequest(request);
  if (!isValid || !interaction) {
    return Response.json({ error: "Bad request signature." }, { status: 401 });
  }

  if (interaction.type === InteractionType.Ping) {
    return Response.json({
      type: InteractionResponseType.Pong,
    });
  }

  switch (interaction.type) {
    case InteractionType.ApplicationCommand:
      return await handleApplicationCommandInteraction(interaction);
    case InteractionType.MessageComponent:
      return await handleMessageComponentInteraction(interaction);
    case InteractionType.ApplicationCommandAutocomplete:
      return await handleApplicationCommandAutocompleteInteraction(interaction);
    case InteractionType.ModalSubmit:
      return await handleModalSubmitInteraction(interaction);
    default:
      break;
  }
}

import { ComponentType, InteractionResponseType, MessageFlags } from "@discordjs/core/http-only";
import { channelLink, roleMention } from "@discordjs/formatters";
import { getRoleIdByName } from "@/lib/discordUtils";
import { confirmationText } from "../message-components/create-ticket-button";
import discordApi from "@/lib/discordApi";
import type { ModalExecutor } from "@/interfaces";

const STAFF_ROLE_ID = await getRoleIdByName("Staff");

const modal: ModalExecutor = {
  custom_id: "create-ticket-modal",
  async execute(interaction) {
    if (!interaction.channel) throw new Error("Interaction channel is undefined");
    if (!interaction.member) throw new Error("Interaction member is undefined");

    const components = interaction.data.components.flatMap(row =>
      row.type == ComponentType.ActionRow ? row.components : []
    );

    const confirmationTextInput = components.find(
      c => c.type === ComponentType.TextInput && c.custom_id === "ticket_modal_confirmation"
    );

    if (!confirmationTextInput || confirmationTextInput.value.trim() !== confirmationText) {
      return {
        type: InteractionResponseType.ChannelMessageWithSource,
        data: {
          content: "Wrong confirmation text. Ticket creation cancelled.",
          flags: MessageFlags.Ephemeral,
        },
      };
    }

    const ticketThread = await discordApi.channels.createThread(interaction.channel.id, {
      name: `ticket-${interaction.member.user.username}`,
      invitable: false,
    });
    await discordApi.threads.addMember(ticketThread.id, interaction.member.user.id);

    if (STAFF_ROLE_ID) {
      discordApi.channels.createMessage(ticketThread.id, { content: "@Staff" }).then(message => {
        discordApi.channels.editMessage(message.channel_id, message.id, { content: roleMention(STAFF_ROLE_ID) });
      });
    }

    return {
      type: InteractionResponseType.ChannelMessageWithSource,
      data: {
        content: `Ticket created: ${channelLink(ticketThread.id)}`,
        flags: MessageFlags.Ephemeral,
      },
    };
  },
};

export default modal;

import { MessageFlags } from "@discordjs/core/http-only";
import { channelLink, roleMention } from "@discordjs/formatters";
import { getRoleIdByName } from "@/lib/discordUtils";
import discordApi from "@/lib/discordApi";
import type { ModalExecutor } from "@/types";

const modal: ModalExecutor = {
  custom_id: "create-ticket-modal",
  async execute(interaction) {
    if (!interaction.channel) throw new Error("Interaction channel is undefined");
    if (!interaction.member) throw new Error("Interaction member is undefined");

    const ticketThread = await discordApi.channels.createThread(interaction.channel.id, {
      name: `ticket-${interaction.member.user.username}`,
      invitable: false,
    });

    await discordApi.interactions.reply(interaction.id, interaction.token, {
      content: `Ticket created: ${channelLink(ticketThread.id)}`,
      flags: MessageFlags.Ephemeral,
    });

    await discordApi.threads.addMember(ticketThread.id, interaction.member.user.id);

    const STAFF_ROLE_ID = await getRoleIdByName("Staff");
    if (STAFF_ROLE_ID) {
      const ticketNotificationMessage1 = "@Staff is being notified of your ticket.".replaceAll(
        "@Staff",
        roleMention(STAFF_ROLE_ID),
      );
      const ticketNotificationMessage2 = "@Staff has been notified of your ticket.".replaceAll(
        "@Staff",
        roleMention(STAFF_ROLE_ID),
      );
      const message = await discordApi.channels.createMessage(ticketThread.id, {
        content: ticketNotificationMessage1,
        allowed_mentions: { parse: [] },
      });
      await discordApi.channels.editMessage(message.channel_id, message.id, {
        content: ticketNotificationMessage2,
        allowed_mentions: { roles: [STAFF_ROLE_ID] },
      });
    }

    return null;
  },
};

export default modal;

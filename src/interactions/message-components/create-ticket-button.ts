import { InteractionResponseType, ComponentType } from "@discordjs/core/http-only";
import type { MessageComponentExecutor } from "@/types";

const button: MessageComponentExecutor = {
  custom_id: "create-ticket-button",
  async execute() {
    return {
      type: InteractionResponseType.Modal,
      data: {
        custom_id: "create-ticket-modal",
        title: "Ticket Creation Confirmation",
        components: [
          {
            type: ComponentType.TextDisplay,
            content: "Are you sure you want to create a ticket?\n\n**TICKETS ARE NOT FOR GENERAL SUPPORT QUESTIONS**",
          },
        ],
      },
    };
  },
};

export default button;

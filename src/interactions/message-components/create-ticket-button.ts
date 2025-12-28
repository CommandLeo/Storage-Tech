import { InteractionResponseType, ComponentType, TextInputStyle } from "@discordjs/core/http-only";
import type { MessageComponentExecutor } from "@/interfaces";

export const confirmationText = "I understand that tickets are not for general support questions.";

const button: MessageComponentExecutor = {
  custom_id: "create-ticket-button",
  async execute() {
    return {
      type: InteractionResponseType.Modal,
      data: {
        custom_id: "create-ticket-modal",
        title: "Create Ticket",
        components: [
          {
            type: ComponentType.TextDisplay,
            content:
              "Confirm that you want to create a ticket by entering the text below:\n\n" + confirmationText,
          },
          {
            type: ComponentType.ActionRow,
            components: [
              {
                type: ComponentType.TextInput,
                custom_id: "ticket_modal_confirmation",
                style: TextInputStyle.Short,
                label: "Enter the text above",
                min_length: 10,
                placeholder: confirmationText,
                required: true,
              },
            ],
          },
        ],
      },
    };
  },
};

export default button;

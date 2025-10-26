import type {
  RESTPostAPIChatInputApplicationCommandsJSONBody,
  APIApplicationCommandInteraction,
  APIInteractionResponse,
} from "@discordjs/core/http-only";

export interface Command {
  data: RESTPostAPIChatInputApplicationCommandsJSONBody;
  execute: (interaction: APIApplicationCommandInteraction) => Promise<APIInteractionResponse>;
}

export interface ChannelInfo {
  name: string;
  display_name: string;
  tags?: string[];
}

export interface MessageInfo {
  messageId: string;
  threadId: string;
  channelId?: string;
  guildId: string;
}

export interface LogEntry {
  id: number;
  timestamp: Date;
  operation: string;
  guildId: string;
  channelId?: string;
  threadId?: string;
  messageId?: string;
}

export interface WorkflowThreadMessage {
  name?: string;
  content?: string;
  content_file?: string;
  files?: string[];
  wait?: boolean;
}

export interface WorkflowTask {
  name?: string;
  folder: string;
  thread_name: string;
  content?: string;
  content_file?: string;
  files?: string[];
  resize_images?: boolean;
  tags?: string[];
  thread_messages?: WorkflowThreadMessage[];
}

export interface Workflow {
  channel: string;
  users?: Record<string, string>;
  tags?: Record<string, string>;
  tasks: WorkflowTask[];
}

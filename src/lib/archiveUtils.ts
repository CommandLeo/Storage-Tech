import type { RawFile } from "@discordjs/rest";
import { messageLink, userMention } from "@discordjs/formatters";
import discordApi from "@/lib/discordApi";
import {
  findForumChannel,
  getChannelWebhook,
  findThreadById,
  convertTagNamesToIds,
  createChannelWebhook,
} from "@/lib/discordUtils";
import { ArchiveError } from "@/lib/errors";
import config from "@/lib/config";

export async function sendArchiveLog({
  action,
  guildId,
  threadId,
  messageId,
  userId,
}: {
  action: string;
  guildId: string;
  threadId: string;
  messageId: string;
  userId?: string;
}) {
  try {
    const logChannelName = config.logChannel;
    const channels = await discordApi.guilds.getChannels(guildId);
    const logChannel = channels.find(c => c.name === logChannelName);

    if (!logChannel) {
      console.warn(`Log channel "${logChannelName}" not found, skipping log`);
      return;
    }

    const messageUrl = messageLink(threadId, messageId, guildId);
    const userPing = userId ? ` | ${userMention(userId)}` : "";

    const logMessage = `**${action}**${userPing}\n${messageUrl}`;

    await discordApi.channels.createMessage(logChannel.id, {
      content: logMessage,
      allowed_mentions: { parse: [] },
    });
  } catch (error) {
    console.error("Failed to send archive log:", error.message);
  }
}

export async function createPost({
  channelName,
  threadName,
  content,
  files,
  tags,
}: {
  channelName: string;
  threadName: string;
  content: string;
  files: RawFile[];
  tags: string[];
}) {
  const channel = await findForumChannel(channelName);
  if (!channel) {
    throw new ArchiveError("Forum channel not found");
  }

  let webhook = await getChannelWebhook(channel.id);
  if (!webhook) {
    webhook = await createChannelWebhook(channel.id, channelName);
  }
  if (!webhook?.token) {
    throw new ArchiveError("Unable to create a webhook for this channel");
  }

  const tagIds = convertTagNamesToIds(channel, tags);

  const result = await discordApi.webhooks.execute(webhook.id, webhook.token, {
    content,
    allowed_mentions: { parse: [] },
    thread_name: threadName,
    applied_tags: tagIds,
    files,
    wait: true,
  });

  return { messageId: result.id, threadId: result.id, guildId: webhook.guild_id };
}

export async function postToThread({
  threadId,
  content,
  files = [],
}: {
  threadId: string;
  content: string;
  files: RawFile[];
}) {
  const thread = await findThreadById(threadId);
  if (!thread) {
    throw new ArchiveError("Thread not found");
  }

  const channelId = thread.parent_id;
  if (!channelId) {
    throw new ArchiveError(`Parent channel for thread ${threadId} not found`);
  }

  const webhook = await getChannelWebhook(channelId);
  if (!webhook?.token) {
    throw new ArchiveError("No webhook found in this channel");
  }

  const result = await discordApi.webhooks.execute(webhook.id, webhook.token, {
    content,
    allowed_mentions: { parse: [] },
    files,
    thread_id: threadId,
    wait: true,
  });

  return { messageId: result.id, threadId: thread.id, guildId: thread.guild_id };
}

export async function editPost({
  threadId,
  messageId,
  content,
  files = [],
}: {
  threadId: string;
  messageId: string;
  content: string | null;
  files: RawFile[];
}) {
  const thread = await findThreadById(threadId);
  if (!thread) {
    throw new ArchiveError("Thread not found");
  }

  const message = await discordApi.channels.getMessage(threadId, messageId);
  if (!message) {
    throw new ArchiveError(`Couldn't find that message in the thread with ID ${thread.id}`);
  }

  const webhookId = message.webhook_id;
  if (!webhookId) {
    throw new ArchiveError("That message was not sent by a webhook and cannot be edited");
  }

  const webhook = await discordApi.webhooks.get(webhookId);
  if (!webhook?.token) {
    throw new ArchiveError(`Couldn't find a webhook with ID ${webhookId}`);
  }

  await discordApi.webhooks.editMessage(webhook.id, webhook.token, messageId, {
    content,
    allowed_mentions: { parse: [] },
    files,
    thread_id: threadId,
  });

  return { messageId: message.id, threadId: thread.id, guildId: thread.guild_id };
}

export async function deleteAllAttachments({ threadId, messageId }: { threadId: string; messageId: string }) {
  const thread = await findThreadById(threadId);
  if (!thread) {
    throw new ArchiveError("Thread not found");
  }

  const message = await discordApi.channels.getMessage(threadId, messageId);
  if (!message) {
    throw new ArchiveError(`Couldn't find that message in the thread with ID ${thread.id}`);
  }

  const webhookId = message.webhook_id;
  if (!webhookId) {
    throw new ArchiveError("That message was not sent by a webhook and cannot have its attachments removed");
  }

  const webhook = await discordApi.webhooks.get(webhookId);
  if (!webhook?.token) {
    throw new ArchiveError(`Couldn't find a webhook with ID ${webhookId}`);
  }

  await discordApi.webhooks.editMessage(webhook.id, webhook.token, messageId, {
    attachments: [],
    thread_id: threadId,
  });

  return { messageId: message.id, threadId: thread.id, guildId: thread.guild_id };
}

export async function deletePost({ threadId, messageId }: { threadId: string; messageId: string }) {
  const thread = await findThreadById(threadId);
  if (!thread) {
    throw new ArchiveError("Thread not found");
  }

  const message = await discordApi.channels.getMessage(threadId, messageId);
  if (!message) {
    throw new ArchiveError(`Couldn't find that message in the thread with ID ${thread.id}`);
  }

  const webhookId = message.webhook_id;
  if (!webhookId) {
    throw new ArchiveError("That message was not sent by a webhook and cannot be deleted");
  }

  const webhook = await discordApi.webhooks.get(webhookId);
  if (!webhook?.token) {
    throw new ArchiveError(`Couldn't find a webhook with ID ${webhookId}`);
  }

  await discordApi.webhooks.deleteMessage(webhook.id, webhook.token, messageId, { thread_id: threadId });

  return { messageId: message.id, threadId: thread.id, guildId: thread.guild_id };
}

export async function getMessageContent({ threadId, messageId }: { threadId: string; messageId: string }) {
  const thread = await findThreadById(threadId);
  if (!thread) {
    throw new ArchiveError("Thread not found");
  }

  const message = await discordApi.channels.getMessage(threadId, messageId);
  if (!message) {
    throw new ArchiveError(`Couldn't find that message in the thread with ID ${thread.id}`);
  }

  return message.content;
}

import { ChannelType, type APIGuildForumChannel, type APIThreadChannel } from "@discordjs/core/http-only";
import discordApi from "@/lib/discordApi";
import config from "@/lib/config";

const guildId = process.env.GUILD_ID;

export async function getRoleIdByName(roleName: string) {
  const guildRoles = await discordApi.guilds.getRoles(guildId);
  const role = guildRoles.find(r => r.name === roleName);
  return role ? role.id : null;
}

export async function hasWhitelistedRole(discordId: string) {
  const rolesWhitelist = config.rolesWhitelist;

  try {
    const member = await discordApi.guilds.getMember(guildId, discordId);

    if (!member.roles) {
      return false;
    }

    const guildRoles = await discordApi.guilds.getRoles(guildId);
    const roleMap = new Map(guildRoles.map(role => [role.id, role.name]));

    const userRoleNames = member.roles.map(roleId => roleMap.get(roleId)).filter(Boolean);

    return userRoleNames.some(roleName => rolesWhitelist.includes(roleName!));
  } catch {
    return false;
  }
}

export async function findForumChannel(channelName: string) {
  const formattedName = `📂︱${channelName}`;
  try {
    const channels = await discordApi.guilds.getChannels(guildId);
    const channel = channels.find(
      c => c.name === formattedName && c.type === ChannelType.GuildForum
    ) as APIGuildForumChannel;
    return channel;
  } catch {
    return null;
  }
}

export async function getChannelWebhook(channelId: string) {
  try {
    const webhooks = await discordApi.channels.getWebhooks(channelId);
    const webhook = webhooks.find(w => w.application_id === process.env.DISCORD_CLIENT_ID);
    return webhook;
  } catch {
    return null;
  }
}

export async function createChannelWebhook(channelId: string, channelName: string) {
  try {
    const webhookName =
      Object.values(config.channels)
        .flat()
        .find(c => c.name === channelName)?.display_name || "Storage Tech";
    const webhook = await discordApi.channels.createWebhook(channelId, { name: webhookName });
    return webhook;
  } catch {
    return null;
  }
}

export async function findThreadById(threadId: string) {
  try {
    const thread = await discordApi.channels.get(threadId);
    if (thread.type !== ChannelType.PublicThread) {
      return null;
    }
    return thread as APIThreadChannel;
  } catch {
    return null;
  }
}

export function convertTagNamesToIds(channel: APIGuildForumChannel, tagNames: string[]) {
  if (!tagNames || !Array.isArray(tagNames)) {
    return [];
  }
  const availableTags = channel.available_tags ?? [];
  const tagIds = [];
  for (const tagName of tagNames) {
    const tag = availableTags.find(t => t.name === tagName);
    if (tag) {
      tagIds.push(tag.id);
    }
  }
  return tagIds;
}

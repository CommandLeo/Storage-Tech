import {
  ChannelType,
  ForumLayoutType,
  SortOrderType,
  type APIGuildChannel,
  type APIEmoji,
  type APIGuildCategoryChannel,
  type GuildChannelType,
  type APIGuildForumChannel,
  type APIGuildForumTag,
  type APIGuildForumDefaultReactionEmoji,
} from "@discordjs/core/http-only";
import discordApi from "@/lib/discordApi";
import config from "@/lib/config";

const transparentImageData =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAYAAADDPmHLAAAAVklEQVR4nO3BMQEAAADCoPVPbQwfoAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOBvAI8AAT4ZY7sAAAAASUVORK5CYII=";

const guildId = process.env.GUILD_ID;

const channelPrefix = "📁︱";

function formatName(name: string) {
  return `${channelPrefix}${name}`;
}

async function findOrCreateCategory(categoryName: string) {
  const channels = await discordApi.guilds.getChannels(guildId);
  let category = channels.find(
    channel => channel.type === ChannelType.GuildCategory && channel.name.toLowerCase() === categoryName.toLowerCase()
  );
  if (!category) {
    try {
      category = (await discordApi.guilds.createChannel(
        guildId,
        {
          name: categoryName,
          type: ChannelType.GuildCategory,
        },
        {
          reason: `Creating ${categoryName} category for Storage Tech`,
        }
      )) as APIGuildCategoryChannel;
      console.log(`Created new category: ${categoryName}`);
    } catch (error) {
      console.error(`Failed to create category ${categoryName}:`, error.message);
      throw new Error(`Could not create category ${categoryName}`);
    }
  }
  return category as APIGuildCategoryChannel;
}

async function findDefaultEmoji(defaultEmojiName: string) {
  const emojis = await discordApi.guilds.getEmojis(guildId);
  const defaultEmoji = emojis.find(emoji => emoji.name === defaultEmojiName);
  if (!defaultEmoji) {
    throw new Error(`Default emoji named '${defaultEmojiName}' not found in the specified guild`);
  }
  return defaultEmoji;
}

async function setupArchiveChannel(
  {
    name,
    displayName,
    tags,
    defaultEmoji,
    index,
  }: { name: string; displayName: string; tags: string[]; defaultEmoji: APIEmoji; index?: number },
  archiveCategory: APIGuildCategoryChannel,
  guildChannels: APIGuildChannel<GuildChannelType>[],
  force = false
) {
  const channelName = formatName(name);
  let channel = guildChannels.find(channel => channel.name === channelName && channel.type === ChannelType.GuildForum);

  const channelSettings = {
    default_forum_layout: ForumLayoutType.GalleryView,
    default_sort_order: SortOrderType.LatestActivity,
    default_tag_setting: "match_all",
    default_auto_archive_duration: 60 * 24,
    default_reaction_emoji: { emoji_id: defaultEmoji.id } as APIGuildForumDefaultReactionEmoji,
    available_tags: tags?.map(tag => ({ name: tag, moderated: false } as APIGuildForumTag)),
    topic: displayName,
    parent_id: archiveCategory.id,
    position: index,
  };

  if (!channel) {
    try {
      channel = (await discordApi.guilds.createChannel(guildId, {
        type: ChannelType.GuildForum,
        name: channelName,
        ...channelSettings,
      })) as APIGuildForumChannel;
      console.log(`Created archive channel: ${channel.name}`);
    } catch (error) {
      console.error(`Failed to create channel ${channelName}:`, error.message);
      throw error;
    }
  } else if (force) {
    try {
      await discordApi.channels.edit(channel.id, channelSettings);
      console.log(`Updated existing archive channel: ${channel.name}`);
    } catch (error) {
      console.error(`Failed to update channel ${channel.name}:`, error.message);
      throw error;
    }
  }

  const webhooks = await discordApi.channels.getWebhooks(channel.id);
  let webhook = webhooks.find(w => w.application_id === process.env.DISCORD_CLIENT_ID);
  if (!webhook) {
    try {
      webhook = await discordApi.channels.createWebhook(channel.id, {
        name: displayName,
        avatar: transparentImageData,
      });
      console.log(`Created webhook '${webhook.name}' in channel: ${channel.name}`);
    } catch (error) {
      console.error(`Failed to create webhook for channel ${channel.name}:`, error.message);
      throw error;
    }
  }

  return channel as APIGuildForumChannel;
}

export async function setupArchive(force = false) {
  const channelsByCategory = config.channels;

  try {
    const defaultEmoji = await findDefaultEmoji(config.defaultEmoji);
    const guildChannels = await discordApi.guilds.getChannels(guildId);

    for (const [categoryName, channels] of Object.entries(channelsByCategory)) {
      console.log(`\nSetting up category: ${categoryName}`);
      const category = await findOrCreateCategory(categoryName);

      for (let i = 0; i < channels.length; i++) {
        const { name, display_name: displayName, tags } = channels[i];
        await setupArchiveChannel({ name, displayName, tags, defaultEmoji, index: i }, category, guildChannels, force);
      }
    }
    console.log("\nArchive setup completed successfully");
  } catch (error) {
    console.error("Error setting up archive:", error.message);
    throw error;
  }
}

export async function setupChannel(channelName: string, force = false) {
  const channelsByCategory = config.channels;

  let channelConfig;
  let categoryName;
  let index;

  for (const [catName, channels] of Object.entries(channelsByCategory)) {
    const idx = channels.findIndex(ch => ch.name === channelName);
    if (idx !== -1) {
      channelConfig = channels[idx];
      categoryName = catName;
      index = idx;
      break;
    }
  }

  if (!channelConfig || !categoryName) {
    const availableChannels = Object.values(channelsByCategory)
      .flat()
      .map(channel => channel.name)
      .join(", ");
    throw new Error(`Channel '${channelName}' not found in configuration. Available channels: ${availableChannels}`);
  }

  try {
    const defaultEmoji = await findDefaultEmoji(config.defaultEmoji);
    const category = await findOrCreateCategory(categoryName);
    const guildChannels = await discordApi.guilds.getChannels(guildId);

    const { name, display_name: displayName, tags } = channelConfig;
    await setupArchiveChannel({ name, displayName, tags, defaultEmoji, index }, category, guildChannels, force);

    console.log(`Channel '${channelName}' setup completed successfully in category '${categoryName}'`);
  } catch (error) {
    console.error(`Error setting up channel '${channelName}':`, error.message);
    throw error;
  }
}

export async function deleteChannels() {
  const guildChannels = await discordApi.guilds.getChannels(guildId);

  for (const channel of guildChannels) {
    if (channel.type === ChannelType.GuildForum && channel.name.startsWith(channelPrefix)) {
      try {
        await discordApi.channels.delete(channel.id, {
          reason: "Deleting existing forum channel before archive setup",
        });
        console.log(`Deleted channel: ${channel.name}`);
      } catch (error) {
        console.error(`Failed to delete channel ${channel.name}:`, error.message);
      }
    }
  }
}

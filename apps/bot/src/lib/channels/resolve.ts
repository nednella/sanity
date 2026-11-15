import {
  CategoryChannel,
  type Client,
  DiscordAPIError,
  type GuildChannel,
  PermissionFlagsBits,
  PermissionsBitField,
  RESTJSONErrorCodes,
  TextChannel
} from "discord.js";

import { channelCache } from "./cache";
import type { ChannelIntent } from "./channels";

const CATEGORY_PERMISSIONS = [
  PermissionFlagsBits.ViewChannel,
  PermissionFlagsBits.SendMessages,
  PermissionFlagsBits.EmbedLinks,
  PermissionFlagsBits.ManageChannels
];

const TEXT_CHANNEL_PERMISSIONS = [
  PermissionFlagsBits.ViewChannel,
  PermissionFlagsBits.SendMessages,
  PermissionFlagsBits.EmbedLinks
];

/**
 * A channel cannot be used. The reason is one of:
 * - `channel-not-set`: no channel is set for the intent.
 * - `missing`: the channel was deleted, or it is not the correct channel type.
 * - `no-access`: the bot lacks the permissions in `missingPermissions`.
 */
export class ChannelUnavailableError extends Error {
  constructor(
    readonly intent: ChannelIntent,
    readonly reason: "missing" | "no-access" | "channel-not-set",
    readonly missingPermissions: string[] = []
  ) {
    super(`${intent} channel is ${reason}`);
    this.name = "ChannelUnavailableError";
  }
}

async function fetchChannel(client: Client, intent: ChannelIntent) {
  const channelId = await resolveChannelId(intent);

  try {
    return await client.channels.fetch(channelId);
  } catch (error) {
    if (!(error instanceof DiscordAPIError)) throw error;
    if (error.code === RESTJSONErrorCodes.UnknownChannel) return null;
    if (error.code === RESTJSONErrorCodes.MissingAccess) {
      throw new ChannelUnavailableError(intent, "no-access", ["ViewChannel"]);
    }
    throw error;
  }
}

function checkChannelPermissions<T extends GuildChannel>(channel: T, intent: ChannelIntent, needed: bigint[]) {
  const permissions = channel.permissionsFor(channel.client.user);
  const missing = permissions ? permissions.missing(needed) : new PermissionsBitField(needed).toArray();
  if (missing.length > 0) throw new ChannelUnavailableError(intent, "no-access", missing);
  return channel;
}

/**
 * The ID of the channel set for an intent, from the cache. It does not ask
 * Discord, so use it when only the ID matters, such as to check which category
 * a channel is in.
 */
export async function resolveChannelId(intent: ChannelIntent) {
  const channelId = await channelCache.channelId(intent);
  if (!channelId) throw new ChannelUnavailableError(intent, "channel-not-set");
  return channelId;
}

/**
 * The category set for an intent, once the bot has checked it can make and post
 * in channels there.
 *
 * Resolve the channel before the server changes anything, so an action that
 * cannot finish in Discord is refused whole.
 */
export async function resolveCategory(client: Client, intent: ChannelIntent) {
  const channel = await fetchChannel(client, intent);
  if (!(channel instanceof CategoryChannel)) throw new ChannelUnavailableError(intent, "missing");
  return checkChannelPermissions(channel, intent, CATEGORY_PERMISSIONS);
}

/**
 * The text channel set for an intent, once the bot has checked it can post
 * there.
 */
export async function resolveTextChannel(client: Client, intent: ChannelIntent) {
  const channel = await fetchChannel(client, intent);
  if (!(channel instanceof TextChannel)) throw new ChannelUnavailableError(intent, "missing");
  return checkChannelPermissions(channel, intent, TEXT_CHANNEL_PERMISSIONS);
}

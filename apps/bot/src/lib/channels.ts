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

import { api } from "./api";

type Channel = { type: ChannelType; label: string };

export const CHANNELS = {
  audit_log: { type: "text", label: "Audit log" },
  admin_review: { type: "text", label: "Admin review" },
  submission_review: { type: "text", label: "Submission review" },
  application_tickets: { type: "category", label: "Application tickets" },
  trial_applications: { type: "category", label: "Trial applications" },
  trial_feedback: { type: "category", label: "Trial feedback" }
} as const satisfies Record<string, Channel>;

// The bot posts in the channels it creates in a category, so a category needs the text permissions too.
const TEXT_PERMISSIONS = [
  PermissionFlagsBits.ViewChannel,
  PermissionFlagsBits.SendMessages,
  PermissionFlagsBits.EmbedLinks
];
const CATEGORY_PERMISSIONS = [...TEXT_PERMISSIONS, PermissionFlagsBits.ManageChannels];

export type ChannelIntent = keyof typeof CHANNELS;
export type ChannelType = "category" | "text" | "voice";

export class ChannelUnavailableError extends Error {
  constructor(
    readonly intent: ChannelIntent,
    readonly reason: "missing" | "no-access" | "not-set",
    readonly missingPermissions: string[] = []
  ) {
    super(`${intent} channel is ${reason}`);
    this.name = "ChannelUnavailableError";
  }
}

export const channelOptions = (type?: ChannelType) =>
  Object.entries(CHANNELS)
    .filter(([, channel]) => !type || channel.type === type)
    .map(([value, { label }]) => ({ name: label, value }));

export const fetchChannels = async () => {
  const channels = await api.get("/v1/discord/channels");
  return new Map(channels.map((channel) => [channel.purpose, channel.channelId]));
};

const fetchChannel = async (client: Client, intent: ChannelIntent) => {
  const channels = await fetchChannels();
  const channelId = channels.get(intent);
  if (!channelId) throw new ChannelUnavailableError(intent, "not-set");

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
};

const checkAccess = <T extends GuildChannel>(channel: T, intent: ChannelIntent, needed: bigint[]) => {
  const permissions = channel.permissionsFor(channel.client.user);
  const missing = permissions ? permissions.missing(needed) : new PermissionsBitField(needed).toArray();
  if (missing.length > 0) throw new ChannelUnavailableError(intent, "no-access", missing);
  return channel;
};

// A command resolves its channel before the server changes anything, so an action that cannot finish in
// Discord is refused whole.
export const resolveCategory = async (client: Client, intent: ChannelIntent) => {
  const channel = await fetchChannel(client, intent);
  if (!(channel instanceof CategoryChannel)) throw new ChannelUnavailableError(intent, "missing");
  return checkAccess(channel, intent, CATEGORY_PERMISSIONS);
};

export const resolveTextChannel = async (client: Client, intent: ChannelIntent) => {
  const channel = await fetchChannel(client, intent);
  if (!(channel instanceof TextChannel)) throw new ChannelUnavailableError(intent, "missing");
  return checkAccess(channel, intent, TEXT_PERMISSIONS);
};

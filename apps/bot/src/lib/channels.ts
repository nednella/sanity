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

export type ChannelPurpose = keyof typeof CHANNELS;
export type ChannelType = "category" | "text" | "voice";

export class ChannelUnavailableError extends Error {
  constructor(
    readonly purpose: ChannelPurpose,
    readonly reason: "missing" | "no-access" | "not-set",
    readonly missingPermissions: string[] = []
  ) {
    super(`${purpose} channel is ${reason}`);
    this.name = "ChannelUnavailableError";
  }
}

export const purposeChoices = (type?: ChannelType) =>
  Object.entries(CHANNELS)
    .filter(([, channel]) => !type || channel.type === type)
    .map(([value, { label }]) => ({ name: label, value }));

export const fetchChannels = async () => {
  const channels = await api.get("/v1/admin/discord/channels");
  return new Map(channels.map((channel) => [channel.purpose, channel.channelId]));
};

const fetchChannel = async (client: Client, purpose: ChannelPurpose) => {
  const channels = await fetchChannels();
  const channelId = channels.get(purpose);
  if (!channelId) throw new ChannelUnavailableError(purpose, "not-set");

  try {
    return await client.channels.fetch(channelId);
  } catch (error) {
    if (!(error instanceof DiscordAPIError)) throw error;
    if (error.code === RESTJSONErrorCodes.UnknownChannel) return null;
    if (error.code === RESTJSONErrorCodes.MissingAccess) {
      throw new ChannelUnavailableError(purpose, "no-access", ["ViewChannel"]);
    }
    throw error;
  }
};

const checkAccess = <T extends GuildChannel>(channel: T, purpose: ChannelPurpose, needed: bigint[]) => {
  const permissions = channel.permissionsFor(channel.client.user);
  const missing = permissions ? permissions.missing(needed) : new PermissionsBitField(needed).toArray();
  if (missing.length > 0) throw new ChannelUnavailableError(purpose, "no-access", missing);
  return channel;
};

// A command resolves its channel before the server changes anything, so an action that cannot finish in
// Discord is refused whole.
export const resolveCategory = async (client: Client, purpose: ChannelPurpose) => {
  const channel = await fetchChannel(client, purpose);
  if (!(channel instanceof CategoryChannel)) throw new ChannelUnavailableError(purpose, "missing");
  return checkAccess(channel, purpose, CATEGORY_PERMISSIONS);
};

export const resolveTextChannel = async (client: Client, purpose: ChannelPurpose) => {
  const channel = await fetchChannel(client, purpose);
  if (!(channel instanceof TextChannel)) throw new ChannelUnavailableError(purpose, "missing");
  return checkAccess(channel, purpose, TEXT_PERMISSIONS);
};

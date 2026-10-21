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

export type ChannelPurpose = keyof typeof CHANNELS;
export type ChannelType = "category" | "text" | "voice";

export class ChannelNotSetError extends Error {
  constructor(readonly purpose: ChannelPurpose) {
    super(`no channel set for ${purpose}`);
    this.name = "ChannelNotSetError";
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

export const requireChannel = async (purpose: ChannelPurpose) => {
  const channels = await fetchChannels();
  const channelId = channels.get(purpose);
  if (!channelId) throw new ChannelNotSetError(purpose);
  return channelId;
};

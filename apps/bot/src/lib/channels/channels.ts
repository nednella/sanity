type Channel = {
  label: string;
  type: ChannelType;
};

export type ChannelIntent = keyof typeof CHANNELS;
export type ChannelType = "category" | "text" | "voice";

/**
 * The channels that the bot works with.
 */
export const CHANNELS = {
  audit_log: { type: "text", label: "Audit log" },
  admin_review: { type: "text", label: "Admin review" },
  submission_review: { type: "text", label: "Submission review" },
  application_tickets: { type: "category", label: "Application tickets" },
  trial_applications: { type: "category", label: "Trial applications" },
  trial_feedback: { type: "category", label: "Trial feedback" }
} as const satisfies Record<string, Channel>;

/**
 * The choices available for a command's options, e.g. `/channel set category`.
 * Accepts an optional channel type to reduce the visible options for a command,
 * e.g. `/channel set category` cannot point to one of the text channel options
 * like `audit_log`, `submission_review`.
 */
export function channelOptions(type?: ChannelType) {
  return Object.entries(CHANNELS)
    .filter(([, channel]) => !type || channel.type === type)
    .map(([value, { label }]) => ({ name: label, value }));
}

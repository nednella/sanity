import {
  type ChatInputCommandInteraction,
  type SlashCommandStringOption,
  TimestampStyles,
  time,
  userMention
} from "discord.js";

import type { CommandOutcome } from "@sanity/api";

import { buildEmbed } from "@/utils/embeds";

const MENTIONED_USER_ID = /(?<=<@!?)\d{17,20}(?=>)/g;

const CHANGES = new Set<CommandOutcome["outcome"]>([
  "admin-given",
  "admin-removed",
  "delayed",
  "passed",
  "plugin-access-reinstated",
  "plugin-access-revoked",
  "quit",
  "ranked",
  "retired",
  "unretired"
]);

// Maps each outcome to a line an admin can read.
const DESCRIPTIONS: Record<CommandOutcome["outcome"], (result: CommandOutcome) => string> = {
  "admin-given": () => "is now an admin",
  "admin-removed": () => "is no longer an admin",
  "already-admin": () => "is already an admin!",
  "already-plugin-access-revoked": () => "already has no plugin access!",
  "already-quit": () => "has already quit the clan!",
  "already-retired": () => "is already retired",
  delayed: ({ until }) => `demotion held until ${time(new Date(until!), TimestampStyles.LongDate)}`,
  "has-plugin-access": () => "already has plugin access!",
  "has-quit": () => "has now quit the clan",
  "is-superuser": () => "is a superuser, so their role cannot change",
  "no-rank-earned": () => "has not earned a rank",
  "no-rank-to-give": () => "has no rank to pass into",
  "not-a-member": () => "is not a member of this clan",
  "not-a-rank-change": () => "needs /member retire or /member quit for that rank",
  "not-a-trialist": () => "is not a trialist!",
  "not-an-admin": () => "is not an admin!",
  "not-retired": () => "is not retired!",
  passed: ({ rank }) => `has passed their trial! Rank: ${rank!.name}`,
  "plugin-access-reinstated": () => "has plugin access again, with a new key from /plugin-key",
  "plugin-access-revoked": () => "has lost plugin access, and their key is revoked",
  quit: () => "has now quit the clan",
  ranked: ({ rank }) => `is now ${rank!.name}`,
  retired: () => "has now been retired",
  unchanged: () => "already has that rank!",
  "unknown-rank": () => "cannot take a rank that does not exist",
  unretired: ({ rank }) => `has been unretired! Rank: ${rank!.name}`
};

const styleOf = (results: CommandOutcome[]) => {
  const changed = results.filter(({ outcome }) => CHANGES.has(outcome)).length;
  if (changed === results.length) return "success";
  return changed === 0 ? "error" : "warning";
};

export const NO_MEMBERS_TAGGED = {
  title: "No members tagged",
  description: "Tag at least one member."
};

export const membersOption = (option: SlashCommandStringOption) =>
  option.setName("members").setDescription("Tag the members").setRequired(true);

export const noteOption = (option: SlashCommandStringOption) =>
  option.setName("note").setDescription("Why, for the audit log").setMaxLength(500);

// Members are tagged in a text option, because a user option holds only one member.
export const readTaggedMembers = (interaction: ChatInputCommandInteraction) => ({
  note: interaction.options.getString("note") ?? undefined,
  taggedDiscordIds: interaction.options.getString("members", true).match(MENTIONED_USER_ID) ?? []
});

export const outcomesEmbed = (title: string, results: CommandOutcome[]) =>
  buildEmbed({
    style: styleOf(results),
    title,
    description: results
      .map((result) => `${userMention(result.discordId)} ${DESCRIPTIONS[result.outcome](result)}`)
      .join("\n")
  });

import { type ChatInputCommandInteraction, type SlashCommandStringOption, userMention } from "discord.js";

import type { MemberChange, MemberSkip } from "@sanity/api";

import { buildEmbed, fitLines } from "@/utils/embeds";

export const NO_MEMBERS_TAGGED = {
  title: "No members tagged",
  description: "Tag at least one member."
};

const FIELD_LIMIT = 1024;

const MENTIONED_USER_ID = /(?<=<@!?)\d{17,20}(?=>)/g;

export function membersOption(option: SlashCommandStringOption) {
  return option.setName("members").setDescription("Tag the members").setRequired(true);
}

export function noteOption(option: SlashCommandStringOption) {
  return option.setName("note").setDescription("Why, for the audit log").setMaxLength(500);
}

// Members are tagged in a text option, because a user option holds only one
// member.
export function readTaggedMembers(interaction: ChatInputCommandInteraction) {
  const taggedDiscordIds = interaction.options.getString("members", true).match(MENTIONED_USER_ID) ?? [];

  return {
    members: taggedDiscordIds.map((discordId) => ({ discordId })),
    note: interaction.options.getString("note") ?? undefined,
    taggedDiscordIds
  };
}

type MemberChanges = {
  changed: MemberChange[];
  skipped: MemberSkip[];
};

export function changesEmbed(
  title: string,
  describeChange: (change: MemberChange) => string,
  changes: MemberChanges,
  taggedDiscordIds: string[]
) {
  const changedLines = changes.changed.map(
    (change) => `${userMention(change.member.discordId)} ${describeChange(change)}`
  );
  const skippedLines = [
    ...changes.skipped.map(({ error, member }) => `${userMention(member.discordId)} ${error.message}`),
    ...toNotMembers(changes, taggedDiscordIds).map(
      (discordId) => `${userMention(discordId)} is not a member of this clan`
    )
  ];

  const fields = [
    ...(changedLines.length > 0 ? [{ name: "Success", value: fitLines(changedLines, FIELD_LIMIT) }] : []),
    ...(skippedLines.length > 0 ? [{ name: "Skipped", value: fitLines(skippedLines, FIELD_LIMIT) }] : [])
  ];

  return buildEmbed({
    style: styleOfChanges(changes.changed, skippedLines),
    title,
    fields
  });
}

function toNotMembers({ changed, skipped }: MemberChanges, taggedDiscordIds: string[]) {
  const found = new Set([...changed, ...skipped].map(({ member }) => member.discordId));
  return taggedDiscordIds.filter((discordId) => !found.has(discordId));
}

function styleOfChanges(changed: MemberChange[], skippedLines: string[]) {
  if (skippedLines.length === 0) return "success";
  return changed.length === 0 ? "error" : "warning";
}

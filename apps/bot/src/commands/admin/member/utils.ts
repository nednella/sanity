import { type ChatInputCommandInteraction, type SlashCommandStringOption, userMention } from "discord.js";

import type { MemberChange, MemberSkip } from "@sanity/api";

import { buildEmbed, fitLines } from "@/utils/embeds";

const FIELD_LIMIT = 1024;

export const MENTIONED_USER_ID = /(?<=<@!?)\d{17,20}(?=>)/g;

type MemberChanges = {
  changed: MemberChange[];
  skipped: MemberSkip[];
};

const toNotMembers = ({ changed, skipped }: MemberChanges, taggedDiscordIds: string[]) => {
  const found = new Set([...changed, ...skipped].map(({ member }) => member.discordId));
  return taggedDiscordIds.filter((discordId) => !found.has(discordId));
};

const styleOfChanges = (changed: MemberChange[], skippedLines: string[]) => {
  if (skippedLines.length === 0) return "success";
  return changed.length === 0 ? "error" : "warning";
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
export const readTaggedMembers = (interaction: ChatInputCommandInteraction) => {
  const taggedDiscordIds = interaction.options.getString("members", true).match(MENTIONED_USER_ID) ?? [];

  return {
    members: taggedDiscordIds.map((discordId) => ({ discordId })),
    note: interaction.options.getString("note") ?? undefined,
    taggedDiscordIds
  };
};

export const changesEmbed = (
  title: string,
  describeChange: (change: MemberChange) => string,
  changes: MemberChanges,
  taggedDiscordIds: string[]
) => {
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
};

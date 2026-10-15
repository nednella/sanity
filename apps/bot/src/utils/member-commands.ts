import {
  type ChatInputCommandInteraction,
  FormattingPatterns,
  type SlashCommandStringOption,
  TimestampStyles,
  time,
  userMention
} from "discord.js";

import type { paths } from "@sanity/api/v1";

import { brandEmbed } from "./embeds";
import { reply, replyError } from "./replies";

type MemberCommandResponse = paths["/v1/admin/members/quit"]["post"]["responses"][200]["content"]["application/json"];
type MemberOutcome = MemberCommandResponse["results"][number];

type MemberCommandBody = {
  actingDiscordId: string;
  note?: string;
  taggedDiscordIds: string[];
};

const DONE = new Set<MemberOutcome["outcome"]>(["delayed", "passed", "quit", "ranked", "retired", "unretired"]);

// The server sets rank and until on exactly the outcomes that read them.
const OUTCOMES: Record<MemberOutcome["outcome"], (result: MemberOutcome) => string> = {
  "already-quit": () => "has already quit",
  "already-retired": () => "is already retired",
  delayed: ({ until }) => `demotion held until ${time(new Date(until!), TimestampStyles.LongDate)}`,
  "has-quit": () => "has quit the clan",
  "no-rank-earned": () => "has not earned a rank",
  "no-rank-to-give": () => "there is no rank to give",
  "not-a-member": () => "is not a member",
  "not-a-rank-change": () => "use /retire or /quitto for that rank",
  "not-a-trialist": () => "is not a trialist",
  "not-retired": () => "is not retired",
  passed: ({ rank }) => `passed their trial as ${rank!.name}`,
  quit: () => "has quit",
  ranked: ({ rank }) => `is now ${rank!.name}`,
  retired: () => "is retired",
  unchanged: () => "already has that rank",
  "unknown-rank": () => "that rank does not exist",
  unretired: ({ rank }) => `is back as ${rank!.name}`
};

const toTone = (results: MemberOutcome[]) => {
  const done = results.filter(({ outcome }) => DONE.has(outcome)).length;
  if (done === results.length) return "success";
  return done === 0 ? "error" : "warning";
};

// A string option takes any number of mentions, where a user option takes one member.
const toTaggedDiscordIds = (text: string) =>
  text
    .matchAll(new RegExp(FormattingPatterns.User, "g"))
    .map(({ groups }) => groups?.id)
    .filter((id) => id !== undefined)
    .toArray();

export const membersOption = (option: SlashCommandStringOption) =>
  option.setName("members").setDescription("Tag the members").setRequired(true);

export const noteOption = (option: SlashCommandStringOption) =>
  option.setName("note").setDescription("Why, for the audit log").setMaxLength(500);

export const runMemberCommand = async (
  interaction: ChatInputCommandInteraction,
  title: string,
  send: (body: MemberCommandBody) => Promise<MemberCommandResponse>
) => {
  const taggedDiscordIds = toTaggedDiscordIds(interaction.options.getString("members", true));
  if (taggedDiscordIds.length === 0) return replyError(interaction, "Tag at least one member.");

  const { results } = await send({
    actingDiscordId: interaction.user.id,
    note: interaction.options.getString("note") ?? undefined,
    taggedDiscordIds
  });

  return reply(
    interaction,
    brandEmbed({
      tone: toTone(results),
      title,
      description: results
        .map((result) => `${userMention(result.discordId)} · ${OUTCOMES[result.outcome](result)}`)
        .join("\n")
    })
  );
};

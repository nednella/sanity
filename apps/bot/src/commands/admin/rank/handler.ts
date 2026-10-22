import { type ChatInputCommandInteraction, channelMention, userMention } from "discord.js";

import type { RankProposal } from "@sanity/api";

import { api } from "@/lib/api";
import { resolveTextChannel } from "@/lib/channels";
import { runSubcommand } from "@/utils/commands";
import { buildEmbed } from "@/utils/embeds";
import { capitalise } from "@/utils/format";
import { reply, replyError } from "@/utils/replies";

import { NO_MEMBERS_TAGGED, outcomesEmbed, readTaggedMembers } from "../member/utils";

const FIELD_LIMIT = 1024;
const OVERFLOW_LINE_ROOM = 20;

const rankName = (name: string) => capitalise(name.toLowerCase());

const describeProposal = ({ discordId, from, to }: RankProposal) =>
  `${userMention(discordId)} ${rankName(from.name)} → ${rankName(to.name)}`;

// A long list stops short of the field limit and counts the members it leaves out.
const fitField = (lines: string[]) => {
  const shown: string[] = [];
  let length = 0;
  for (const line of lines) {
    length += line.length + 1;
    if (length > FIELD_LIMIT - OVERFLOW_LINE_ROOM) break;
    shown.push(line);
  }

  const hidden = lines.length - shown.length;
  return (hidden === 0 ? shown : [...shown, `…and ${hidden} more`]).join("\n");
};

const proposalField = (name: string, proposals: RankProposal[]) => ({
  name: `${name} (${proposals.length})`,
  value: fitField(proposals.map((proposal) => describeProposal(proposal)))
});

const check = async (interaction: ChatInputCommandInteraction) => {
  const channel = await resolveTextChannel(interaction.client, "admin_review");
  const { proposals } = await api.post("/v1/admin/members/bulk-rank-check");

  const promotions = proposals.filter(({ direction }) => direction === "promotion");
  const demotions = proposals.filter(({ direction }) => direction === "demotion");
  const fields = [
    ...(promotions.length > 0 ? [proposalField("Promotions", promotions)] : []),
    ...(demotions.length > 0 ? [proposalField("Demotions", demotions)] : [])
  ];

  const message = await channel.send({
    embeds: [
      buildEmbed({
        title: "Rank changes due",
        description: proposals.length === 0 ? "No member is due a rank change." : undefined,
        fields
      })
    ]
  });
  await reply(
    interaction,
    buildEmbed({
      style: "success",
      title: "Rank check posted",
      description: `[See it](${message.url}) in ${channelMention(channel.id)}.`
    })
  );
};

const holdDemotion = async (interaction: ChatInputCommandInteraction) => {
  const body = readTaggedMembers(interaction);
  if (body.taggedDiscordIds.length === 0) return replyError(interaction, NO_MEMBERS_TAGGED);

  const { results } = await api.post("/v1/admin/members/delay-demotion", { body });
  return reply(interaction, outcomesEmbed("Hold demotion", results));
};

const set = async (interaction: ChatInputCommandInteraction) => {
  const body = readTaggedMembers(interaction);
  if (body.taggedDiscordIds.length === 0) return replyError(interaction, NO_MEMBERS_TAGGED);

  const name = interaction.options.getString("rank", true);
  const ranks = await api.get("/v1/ranks");
  const rank = ranks.find((candidate) => candidate.name.toLowerCase() === name.toLowerCase());
  if (!rank) {
    return replyError(interaction, {
      title: "Unknown rank",
      description: `No rank is named ${name}. The ranks are ${ranks.map((candidate) => candidate.name).join(", ")}.`
    });
  }

  const { results } = await api.post("/v1/admin/members/rank", { body: { ...body, rankId: rank.id } });
  return reply(interaction, outcomesEmbed("Set rank", results));
};

const SUBCOMMANDS = {
  check,
  hold_demotion: holdDemotion,
  set
};

export const handleRank = (interaction: ChatInputCommandInteraction) => runSubcommand(interaction, SUBCOMMANDS);

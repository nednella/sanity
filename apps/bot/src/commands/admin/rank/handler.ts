import { type ChatInputCommandInteraction, TimestampStyles, channelMention, time, userMention } from "discord.js";

import type { MemberChange, RankProposal } from "@sanity/api";

import { api } from "@/lib/api";
import { resolveTextChannel } from "@/lib/channels";
import { runSubcommand } from "@/utils/commands";
import { buildEmbed, fitLines } from "@/utils/embeds";
import { capitalise } from "@/utils/format";
import { reply, replyError } from "@/utils/replies";

import { NO_MEMBERS_TAGGED, changesEmbed, readTaggedMembers } from "../member/utils";

const FIELD_LIMIT = 1024;

const rankName = (name: string) => capitalise(name.toLowerCase());

const describeProposal = ({ discordId, from, to }: RankProposal) =>
  `${userMention(discordId)} ${rankName(from.name)} → ${rankName(to.name)}`;

const proposalField = (name: string, proposals: RankProposal[]) => ({
  name: `${name} (${proposals.length})`,
  value: fitLines(
    proposals.map((proposal) => describeProposal(proposal)),
    FIELD_LIMIT
  )
});

const check = async (interaction: ChatInputCommandInteraction) => {
  const channel = await resolveTextChannel(interaction.client, "admin_review");
  const { proposals } = await api.post("/v1/members/bulk-rank-check");

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

const describeDelay = ({ until }: MemberChange) =>
  `demotion held until ${time(new Date(until!), TimestampStyles.LongDate)}`;

const holdDemotion = async (interaction: ChatInputCommandInteraction) => {
  const { taggedDiscordIds, ...body } = readTaggedMembers(interaction);
  if (taggedDiscordIds.length === 0) return replyError(interaction, NO_MEMBERS_TAGGED);

  const changes = await api.post("/v1/members/delay-demotion", { body });
  return reply(interaction, changesEmbed("Hold demotion", describeDelay, changes, taggedDiscordIds));
};

const set = async (interaction: ChatInputCommandInteraction) => {
  const { taggedDiscordIds, ...body } = readTaggedMembers(interaction);
  if (taggedDiscordIds.length === 0) return replyError(interaction, NO_MEMBERS_TAGGED);

  const name = interaction.options.getString("rank", true);
  const ranks = await api.get("/v1/ranks");
  const rank = ranks.find((candidate) => candidate.name.toLowerCase() === name.toLowerCase());
  if (!rank) {
    return replyError(interaction, {
      title: "Unknown rank",
      description: `No rank is named ${name}. The ranks are ${ranks.map((candidate) => candidate.name).join(", ")}.`
    });
  }

  const changes = await api.post("/v1/members/rank", { body: { ...body, rankId: rank.id } });
  return reply(
    interaction,
    changesEmbed("Set rank", (change) => `is now ${change.rank!.name}`, changes, taggedDiscordIds)
  );
};

const SUBCOMMANDS = {
  check,
  hold_demotion: holdDemotion,
  set
};

export const handleRank = (interaction: ChatInputCommandInteraction) => runSubcommand(interaction, SUBCOMMANDS);

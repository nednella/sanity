import { type ChatInputCommandInteraction, TimestampStyles, channelMention, time, userMention } from "discord.js";

import type { MemberChange, RankProposal } from "@sanity/api";
import { capitalise } from "@sanity/utils";

import { api } from "@/lib/api";
import { resolveTextChannel } from "@/lib/channels";
import { runSubcommand } from "@/utils/commands";
import { EMBED_FIELD_MAX_LENGTH, buildEmbed, fitLines } from "@/utils/embeds";
import { reply, replyError } from "@/utils/replies";

import { NO_MEMBERS_TAGGED, changesEmbed, readTaggedMembers } from "../member/utils";

const SUBCOMMANDS = {
  check,
  hold_demotion: holdDemotion,
  set
};

export function handleRank(interaction: ChatInputCommandInteraction) {
  return runSubcommand(interaction, SUBCOMMANDS);
}

function rankName(name: string) {
  return capitalise(name.toLowerCase());
}

function describeProposal({ discordId, from, to }: RankProposal) {
  return `${userMention(discordId)} ${rankName(from.name)} → ${rankName(to.name)}`;
}

function proposalField(name: string, proposals: RankProposal[]) {
  return {
    name: `${name} (${proposals.length})`,
    value: fitLines(
      proposals.map((proposal) => describeProposal(proposal)),
      EMBED_FIELD_MAX_LENGTH
    )
  };
}

async function check(interaction: ChatInputCommandInteraction) {
  const channel = await resolveTextChannel(interaction.client, "admin_review");
  const { proposals } = await api.post("/v1/members/propose-rank-changes");

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
}

function describeDelay({ until }: MemberChange) {
  return `demotion held until ${time(new Date(until!), TimestampStyles.LongDate)}`;
}

async function holdDemotion(interaction: ChatInputCommandInteraction) {
  const { taggedDiscordIds, ...body } = readTaggedMembers(interaction);
  if (taggedDiscordIds.length === 0) return replyError(interaction, NO_MEMBERS_TAGGED);

  const changes = await api.post("/v1/members/delay-demotion", { body });
  return reply(interaction, changesEmbed("Hold demotion", describeDelay, changes, taggedDiscordIds));
}

async function set(interaction: ChatInputCommandInteraction) {
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
}

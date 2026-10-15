import { type ChatInputCommandInteraction, userMention } from "discord.js";

import type { RankProposal } from "@sanity/api";

import { api } from "@/lib/api";
import { brandEmbed } from "@/utils/embeds";
import { reply } from "@/utils/replies";

const DESCRIPTION_LIMIT = 4096;

const describe = ({ discordId, from, to }: RankProposal) => `${userMention(discordId)} · ${from.name} → ${to.name}`;

const section = (heading: string, proposals: RankProposal[]) =>
  proposals.length === 0 ? [] : [`**${heading}**`, ...proposals.map((proposal) => describe(proposal))];

// A full clan can propose more changes than one embed holds, so the list stops short and counts the rest.
const fit = (lines: string[]) => {
  const shown: string[] = [];
  let length = 0;
  for (const line of lines) {
    length += line.length + 1;
    if (length > DESCRIPTION_LIMIT - 50) break;
    shown.push(line);
  }
  return shown.length === lines.length ? shown : [...shown, `…and ${lines.length - shown.length} more`];
};

export const handleCheckRank = async (interaction: ChatInputCommandInteraction) => {
  const { checked, proposals } = await api.post("/v1/admin/members/bulk-rank-check");
  const promotions = proposals.filter(({ direction }) => direction === "promotion");
  const demotions = proposals.filter(({ direction }) => direction === "demotion");
  const lines = fit([
    `Checked ${checked} members: ${promotions.length} promotions, ${demotions.length} demotions.`,
    ...section("Promotions", promotions),
    ...section("Demotions", demotions)
  ]);

  await reply(
    interaction,
    brandEmbed({
      title: "Rank Check",
      description: lines.join("\n")
    })
  );
};

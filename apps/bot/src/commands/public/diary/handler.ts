import { type ChatInputCommandInteraction, bold } from "discord.js";

import type { MemberDiary } from "@sanity/api";

import { config } from "@config";

import { api } from "@/lib/api";
import { brandEmbed } from "@/utils/embeds";
import { findMember } from "@/utils/members";
import { reply, replyNotAMember } from "@/utils/replies";

const SCALE_NAMES: Record<number, string> = {
  1: "Solo",
  2: "Duo",
  3: "Trio"
};

type ReachedEntry = MemberDiary & { tier: NonNullable<MemberDiary["tier"]> };

const describeEntry = ({ content, scale, tier }: ReachedEntry) =>
  `${bold(content.name)} · ${SCALE_NAMES[scale] ?? `${scale}-man`} · ${tier.name}`;

export const handleDiary = async (interaction: ChatInputCommandInteraction) => {
  const user = interaction.options.getUser("member") ?? interaction.user;
  const member = await findMember(user);
  if (!member) return replyNotAMember(interaction, user);

  const params = { path: { id: member.id } };
  const [{ diary }, entries] = await Promise.all([
    api.get("/v1/members/{id}", { params }),
    api.get("/v1/members/{id}/diary", { params })
  ]);
  const reached = entries.filter((entry): entry is ReachedEntry => entry.tier !== null);

  return reply(
    interaction,
    brandEmbed({
      title: `${member.displayName}'s Diary · ${diary.points} points · ${diary.masterDiaries} master`,
      description:
        reached.length > 0 ? reached.map((entry) => describeEntry(entry)).join("\n") : "No diary tiers reached yet."
    }).setURL(`${config.webUrl}/members/${member.id}`)
  );
};

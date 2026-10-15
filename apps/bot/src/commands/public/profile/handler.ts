import { type ChatInputCommandInteraction, TimestampStyles, time } from "discord.js";

import type { MemberProfile } from "@sanity/api";

import { config } from "@config";

import { api } from "@/lib/api";
import { brandEmbed } from "@/utils/embeds";
import { findMember } from "@/utils/members";
import { reply, replyNotAMember } from "@/utils/replies";

const describePoints = ({ membership, progression }: MemberProfile) => {
  const points = membership.points.toLocaleString("en-GB");
  const next = progression.nextRank.points;
  return next ? `${points} / ${next.requirements.clanPoints.toLocaleString("en-GB")} for ${next.name}` : points;
};

const describeJoined = ({ membership }: MemberProfile) =>
  membership.joinedAt ? time(new Date(membership.joinedAt), TimestampStyles.LongDate) : "Unknown";

const describeDiary = ({ diary }: MemberProfile) =>
  `${diary.points} points · ${diary.masterDiaries} master · ${diary.claimedTier?.name ?? "no"} tier`;

export const handleProfile = async (interaction: ChatInputCommandInteraction) => {
  const user = interaction.options.getUser("member") ?? interaction.user;
  const member = await findMember(user);
  if (!member) return replyNotAMember(interaction, user);

  const profile = await api.get("/v1/members/{id}", { params: { path: { id: member.id } } });
  const { membership, nationality, rsn } = profile;

  return reply(
    interaction,
    brandEmbed({
      title: profile.displayName,
      description: nationality ? `:flag_${nationality.toLowerCase()}:` : undefined,
      thumbnail: profile.discord.avatarUrl ?? user.displayAvatarURL(),
      fields: [
        { name: "Rank", value: membership.rank.name, inline: true },
        { name: "Points", value: describePoints(profile), inline: true },
        { name: "Joined", value: describeJoined(profile), inline: true },
        { name: "Main RSN", value: rsn.main ?? "Not set", inline: true },
        { name: "Alt RSN", value: rsn.alt ?? "None", inline: true },
        { name: "Diary", value: describeDiary(profile), inline: true }
      ]
    }).setURL(`${config.webUrl}/members/${profile.id}`)
  );
};

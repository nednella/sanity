import { type ChatInputCommandInteraction, TimestampStyles, bold, time } from "discord.js";

import { api } from "@/lib/api";
import { brandEmbed } from "@/utils/embeds";
import { findMember } from "@/utils/members";
import { reply, replyError, replyNotAMember } from "@/utils/replies";

export const handleAge = async (interaction: ChatInputCommandInteraction) => {
  const user = interaction.options.getUser("member") ?? interaction.user;
  const member = await findMember(user);
  if (!member) return replyNotAMember(interaction, user);

  const { membership } = await api.get("/v1/members/{id}", { params: { path: { id: member.id } } });
  if (!membership.joinedAt) return replyError(interaction, `${bold(member.displayName)} has no join date set.`);

  const joinedAt = new Date(membership.joinedAt);
  return reply(
    interaction,
    brandEmbed({
      description: `${bold(member.displayName)} joined the clan ${time(joinedAt, TimestampStyles.RelativeTime)}, on ${time(joinedAt, TimestampStyles.LongDate)}.`
    })
  );
};

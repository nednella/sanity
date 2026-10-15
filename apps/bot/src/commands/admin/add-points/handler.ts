import { type ChatInputCommandInteraction, userMention } from "discord.js";

import { api } from "@/lib/api";
import { successEmbed } from "@/utils/embeds";
import { findMember } from "@/utils/members";
import { reply, replyError, replyNotAMember } from "@/utils/replies";

export const handleAddPoints = async (interaction: ChatInputCommandInteraction) => {
  const user = interaction.options.getUser("member", true);
  const points = interaction.options.getInteger("points", true);
  const notes = interaction.options.getString("notes", true);

  if (points === 0) return replyError(interaction, "Cannot award nothing.");

  const [member, admin] = await Promise.all([findMember(user), findMember(interaction.user)]);
  if (!member) return replyNotAMember(interaction, user);
  if (!admin) return replyNotAMember(interaction, interaction.user);

  await api.post("/v1/admin/points", {
    body: {
      memberId: member.id,
      awardedByMemberId: admin.id,
      points,
      notes
    }
  });

  const verb = points > 0 ? `Awarded ${points} points to` : `Deducted ${-points} points from`;
  return reply(interaction, successEmbed({ description: `${verb} ${userMention(user.id)}: ${notes}` }));
};

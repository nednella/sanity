import type { ChatInputCommandInteraction } from "discord.js";

import { api } from "@/lib/api";
import { successEmbed } from "@/utils/embeds";
import { findMember } from "@/utils/members";
import { reply, replyNotAMember } from "@/utils/replies";

export const handleSetNationality = async (interaction: ChatInputCommandInteraction) => {
  const nationality = interaction.options.getString("country", true).toUpperCase();

  const member = await findMember(interaction.user);
  if (!member) return replyNotAMember(interaction, interaction.user);

  await api.patch("/v1/members/{id}", {
    params: { path: { id: member.id } },
    body: {
      actingDiscordId: interaction.user.id,
      nationality
    }
  });

  return reply(interaction, successEmbed({ description: `Your flag is now :flag_${nationality.toLowerCase()}:.` }));
};

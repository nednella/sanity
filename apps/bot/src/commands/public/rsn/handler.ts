import { type ChatInputCommandInteraction, inlineCode } from "discord.js";

import { api } from "@/lib/api";
import { buildEmbed } from "@/utils/embeds";
import { reply, replyError } from "@/utils/replies";

const NO_RSN_GIVEN = {
  title: "No RSN given",
  description: "Give a new main RSN, a new alt RSN, or both."
};

export const handleRsn = async (interaction: ChatInputCommandInteraction) => {
  const mainRsn = interaction.options.getString("main") ?? undefined;
  const altRsn = interaction.options.getString("alt") ?? undefined;
  if (!mainRsn && !altRsn) return replyError(interaction, NO_RSN_GIVEN);

  await api.patch("/v1/members/me", { body: { altRsn, mainRsn } });

  const lines = [
    mainRsn ? `Your main RSN is now ${inlineCode(mainRsn)}.` : null,
    altRsn ? `Your alt RSN is now ${inlineCode(altRsn)}.` : null
  ].filter(Boolean);
  return reply(interaction, buildEmbed({ style: "success", title: "RSN changed", description: lines.join("\n") }));
};

import type { ChatInputCommandInteraction } from "discord.js";

import { api } from "@/lib/api";
import { runMemberCommand } from "@/utils/member-commands";
import { replyError } from "@/utils/replies";

export const handleRank = async (interaction: ChatInputCommandInteraction) => {
  const name = interaction.options.getString("rank", true).toLowerCase();
  const ranks = await api.get("/v1/ranks");
  const rank = ranks.find((candidate) => candidate.name.toLowerCase() === name);
  if (!rank)
    return replyError(interaction, `No rank has that name. Ranks: ${ranks.map(({ name }) => name).join(", ")}`);

  return runMemberCommand(interaction, "Rank", (body) =>
    api.post("/v1/admin/members/rank", { body: { ...body, rankId: rank.id } })
  );
};

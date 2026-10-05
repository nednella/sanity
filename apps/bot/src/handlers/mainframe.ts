import type { ChatInputCommandInteraction } from "discord.js";

import { api } from "@/lib/api";

export const handleMainframe = async (interaction: ChatInputCommandInteraction) => {
  await interaction.deferReply();
  const started = Date.now();
  await api.GET("/v1/health");

  await interaction.editReply(`API is up, answered in ${Date.now() - started}ms.`);
};

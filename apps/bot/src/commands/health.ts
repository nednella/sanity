import { SlashCommandBuilder } from "discord.js";

import { api } from "@/lib/api";
import { defineCommand } from "@/utils/commands";

export const health = defineCommand(
  new SlashCommandBuilder().setName("health").setDescription("Check the bot can reach the API"),
  async (interaction) => {
    await interaction.deferReply();
    const started = Date.now();
    await api.GET("/v1/health");

    await interaction.editReply(`API is up, answered in ${Date.now() - started}ms.`);
  }
);

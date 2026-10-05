import { SlashCommandBuilder } from "discord.js";

import { api } from "@/lib/api";
import { defineCommand } from "@/utils/commands";

export const mainframe = defineCommand(
  new SlashCommandBuilder().setName("mainframe").setDescription("Check the mainframe is alive"),
  async (interaction) => {
    await interaction.deferReply();
    const started = Date.now();
    await api.GET("/v1/health");

    await interaction.editReply(`API is up, answered in ${Date.now() - started}ms.`);
  }
);

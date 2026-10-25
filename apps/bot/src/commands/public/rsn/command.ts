import { SlashCommandBuilder } from "discord.js";

import { defineCommand } from "@/utils/commands";

import { handleRsn } from "./handler";

export const rsn = defineCommand({
  data: new SlashCommandBuilder()
    .setName("rsn")
    .setDescription("Change your main or alt RSN")
    .addStringOption((option) => option.setName("main").setDescription("Your new main RSN").setMaxLength(12))
    .addStringOption((option) => option.setName("alt").setDescription("Your new alt RSN").setMaxLength(12)),
  category: "Profile",
  selfOnly: true,
  execute: handleRsn
});

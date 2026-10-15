import { SlashCommandBuilder } from "discord.js";

import { defineCommand } from "@/utils/commands";

import { handleTrial } from "./handler";

export const trial = defineCommand({
  data: new SlashCommandBuilder()
    .setName("trial")
    .setDescription("Start a member's trial")
    .addUserOption((option) => option.setName("member").setDescription("Tag the trialist").setRequired(true))
    .addStringOption((option) =>
      option.setName("main_rsn").setDescription("Their main RSN").setRequired(true).setMaxLength(12)
    )
    .addStringOption((option) => option.setName("alt_rsn").setDescription("Their alt RSN").setMaxLength(12)),
  category: "Membership",
  admin: true,
  execute: handleTrial
});

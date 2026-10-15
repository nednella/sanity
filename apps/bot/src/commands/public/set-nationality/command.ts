import { SlashCommandBuilder } from "discord.js";

import { defineCommand } from "@/utils/commands";

import { handleSetNationality } from "./handler";

export const setNationality = defineCommand({
  data: new SlashCommandBuilder()
    .setName("set_nationality")
    .setDescription("Set the flag shown on your profile")
    .addStringOption((option) =>
      option
        .setName("country")
        .setDescription("Two-letter country code, such as GB")
        .setMinLength(2)
        .setMaxLength(2)
        .setRequired(true)
    ),
  category: "Profile",
  selfOnly: true,
  execute: handleSetNationality
});

import { SlashCommandBuilder } from "discord.js";

import { defineCommand } from "@/utils/commands";

import { MAX_DAYS, handleBirthdays, suggestDays } from "./handler";

export const birthdays = defineCommand({
  data: new SlashCommandBuilder()
    .setName("birthdays")
    .setDescription("See upcoming birthdays")
    .addIntegerOption((option) =>
      option
        .setName("days")
        .setDescription("How many days ahead to look, from today")
        .setMinValue(1)
        .setMaxValue(MAX_DAYS)
        .setAutocomplete(true)
        .setRequired(true)
    ),
  category: "Misc",
  execute: handleBirthdays,
  autocomplete: suggestDays
});

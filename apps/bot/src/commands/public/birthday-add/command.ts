import { SlashCommandBuilder } from "discord.js";

import { defineCommand } from "@/utils/commands";

import { handleBirthdayAdd } from "./handler";

export const birthdayAdd = defineCommand({
  data: new SlashCommandBuilder()
    .setName("birthday_add")
    .setDescription("Add your birthday")
    .addIntegerOption((option) =>
      option.setName("day").setDescription("Which day").setMinValue(1).setMaxValue(31).setRequired(true)
    )
    .addIntegerOption((option) =>
      option.setName("month").setDescription("Which month").setMinValue(1).setMaxValue(12).setRequired(true)
    )
    .addIntegerOption((option) =>
      option.setName("year").setDescription("Which year").setMinValue(1901).setMaxValue(new Date().getFullYear())
    ),
  category: "Profile",
  selfOnly: true,
  execute: handleBirthdayAdd
});

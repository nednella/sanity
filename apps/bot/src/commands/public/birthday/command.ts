import { SlashCommandBuilder } from "discord.js";

import { defineCommand } from "@/utils/commands";

import { handleBirthday } from "./handler";

export const birthday = defineCommand({
  data: new SlashCommandBuilder()
    .setName("birthday")
    .setDescription("Change your birthday")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("set")
        .setDescription("Set your birthday")
        .addIntegerOption((option) =>
          option.setName("day").setDescription("Which day").setMinValue(1).setMaxValue(31).setRequired(true)
        )
        .addIntegerOption((option) =>
          option.setName("month").setDescription("Which month").setMinValue(1).setMaxValue(12).setRequired(true)
        )
        .addIntegerOption((option) =>
          option.setName("year").setDescription("Which year").setMinValue(1900).setMaxValue(9999).setRequired(true)
        )
    )
    .addSubcommand((subcommand) => subcommand.setName("remove").setDescription("Remove your birthday")),
  category: "Profile",
  selfOnly: true,
  execute: handleBirthday
});

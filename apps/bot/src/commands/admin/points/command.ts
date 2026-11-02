import { SlashCommandBuilder } from "discord.js";

import { defineCommand } from "@/utils/commands";

import { handlePoints } from "./handler";

export const points = defineCommand({
  data: new SlashCommandBuilder()
    .setName("points")
    .setDescription("Manage the clan's points")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("multiplier")
        .setDescription("Raise the points that drops pay for a few days")
        .addNumberOption((option) =>
          option
            .setName("value")
            .setDescription("How much to multiply points by")
            .setRequired(true)
            .setMinValue(1.1)
            .setMaxValue(2)
        )
        .addIntegerOption((option) =>
          option
            .setName("days")
            .setDescription("How many days it lasts")
            .setRequired(true)
            .setMinValue(1)
            .setMaxValue(12)
        )
        .addStringOption((option) =>
          option.setName("reason").setDescription("Why, for the audit log").setRequired(true).setMaxLength(200)
        )
        .addStringOption((option) =>
          option.setName("members").setDescription("Tag the members it is for, or leave it out for everyone")
        )
        .addStringOption((option) =>
          option
            .setName("boss")
            .setDescription("Only this boss's drops, or leave it out for every boss")
            .setMaxLength(64)
        )
    ),
  category: "Points",
  admin: true,
  execute: handlePoints
});

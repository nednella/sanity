import { SlashCommandBuilder } from "discord.js";

import { defineCommand } from "@/utils/commands";

import { handleAddPoints } from "./handler";

export const addPoints = defineCommand({
  data: new SlashCommandBuilder()
    .setName("add_points")
    .setDescription("Award or deduct clan points by hand")
    .addUserOption((option) => option.setName("member").setDescription("Who gets the points").setRequired(true))
    .addIntegerOption((option) =>
      option
        .setName("points")
        .setDescription("How many points; negative deducts")
        .setMinValue(-10_000)
        .setMaxValue(10_000)
        .setRequired(true)
    )
    .addStringOption((option) =>
      option.setName("notes").setDescription("Why the points are given").setMaxLength(200).setRequired(true)
    ),
  category: "Points",
  admin: true,
  execute: handleAddPoints
});

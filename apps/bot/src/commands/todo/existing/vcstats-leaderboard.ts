import { SlashCommandBuilder } from "discord.js";

import { defineCommand } from "@/utils/commands";
import { replyNotImplemented } from "@/utils/replies";

export const vcstatsLeaderboard = defineCommand({
  data: new SlashCommandBuilder()
    .setName("vcstats_leaderboard")
    .setDescription("See who has spent the most time in voice"),
  category: "Voice",
  execute: replyNotImplemented
});

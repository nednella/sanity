import { SlashCommandBuilder } from "discord.js";

import { defineCommand } from "@/utils/commands";
import { replyNotImplemented } from "@/utils/replies";

export const leaderboard = defineCommand({
  data: new SlashCommandBuilder().setName("leaderboard").setDescription("See the leaderboards"),
  category: "Records",
  execute: replyNotImplemented
});

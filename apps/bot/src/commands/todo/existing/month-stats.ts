import { SlashCommandBuilder } from "discord.js";

import { defineCommand } from "@/utils/commands";
import { replyNotImplemented } from "@/utils/replies";

export const monthStats = defineCommand({
  data: new SlashCommandBuilder().setName("month_stats").setDescription("See this month's clan stats"),
  category: "Records",
  execute: replyNotImplemented
});

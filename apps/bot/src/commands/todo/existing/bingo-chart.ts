import { SlashCommandBuilder } from "discord.js";

import { defineCommand } from "@/utils/commands";
import { replyNotImplemented } from "@/utils/replies";

export const bingoChart = defineCommand({
  data: new SlashCommandBuilder().setName("bingo_chart").setDescription("Show the bingo chart"),
  category: "Events",
  execute: replyNotImplemented
});

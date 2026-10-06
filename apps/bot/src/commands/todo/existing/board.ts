import { SlashCommandBuilder } from "discord.js";

import { defineCommand } from "@/utils/commands";
import { replyNotImplemented } from "@/utils/replies";

export const board = defineCommand({
  data: new SlashCommandBuilder().setName("board").setDescription("Show the bingo board"),
  category: "Events",
  execute: replyNotImplemented
});

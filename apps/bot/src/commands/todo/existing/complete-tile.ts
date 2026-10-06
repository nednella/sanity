import { SlashCommandBuilder } from "discord.js";

import { defineCommand } from "@/utils/commands";
import { replyNotImplemented } from "@/utils/replies";

export const completeTile = defineCommand({
  data: new SlashCommandBuilder().setName("complete_tile").setDescription("Complete a bingo tile"),
  category: "Events",
  execute: replyNotImplemented
});

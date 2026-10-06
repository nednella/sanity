import { SlashCommandBuilder } from "discord.js";

import { defineCommand } from "@/utils/commands";
import { replyNotImplemented } from "@/utils/replies";

export const roll = defineCommand({
  data: new SlashCommandBuilder().setName("roll").setDescription("Roll the dice for dice bingo"),
  category: "Events",
  execute: replyNotImplemented
});

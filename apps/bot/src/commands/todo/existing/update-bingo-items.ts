import { SlashCommandBuilder } from "discord.js";

import { defineCommand } from "@/utils/commands";
import { replyNotImplemented } from "@/utils/replies";

export const updateBingoItems = defineCommand({
  data: new SlashCommandBuilder().setName("update_bingo_items").setDescription("Upload the bingo items"),
  category: "Events",
  admin: true,
  execute: replyNotImplemented
});

import { SlashCommandBuilder } from "discord.js";

import { defineCommand } from "@/utils/commands";
import { replyNotImplemented } from "@/utils/replies";

export const progress = defineCommand({
  data: new SlashCommandBuilder().setName("progress").setDescription("Show a bingo team's progress"),
  category: "Events",
  execute: replyNotImplemented
});

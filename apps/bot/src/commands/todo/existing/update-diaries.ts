import { SlashCommandBuilder } from "discord.js";

import { defineCommand } from "@/utils/commands";
import { replyNotImplemented } from "@/utils/replies";

export const updateDiaries = defineCommand({
  data: new SlashCommandBuilder().setName("update_diaries").setDescription("Recompute diary points and personal bests"),
  category: "Diary",
  admin: true,
  execute: replyNotImplemented
});

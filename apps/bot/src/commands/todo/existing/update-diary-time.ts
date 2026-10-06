import { SlashCommandBuilder } from "discord.js";

import { defineCommand } from "@/utils/commands";
import { replyNotImplemented } from "@/utils/replies";

export const updateDiaryTime = defineCommand({
  data: new SlashCommandBuilder().setName("update_diary_time").setDescription("Set the times for a diary tier"),
  category: "Diary",
  admin: true,
  execute: replyNotImplemented
});

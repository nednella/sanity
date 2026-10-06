import { SlashCommandBuilder } from "discord.js";

import { defineCommand } from "@/utils/commands";
import { replyNotImplemented } from "@/utils/replies";

export const updateDiaryTierClaimed = defineCommand({
  data: new SlashCommandBuilder()
    .setName("update_diary_tier_claimed")
    .setDescription("Set the diary tier a member has claimed"),
  category: "Diary",
  admin: true,
  execute: replyNotImplemented
});

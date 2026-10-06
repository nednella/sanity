import { SlashCommandBuilder } from "discord.js";

import { defineCommand } from "@/utils/commands";
import { replyNotImplemented } from "@/utils/replies";

export const awardFix = defineCommand({
  data: new SlashCommandBuilder().setName("award_fix").setDescription("Build the Sanity awards embed"),
  category: "Events",
  admin: true,
  execute: replyNotImplemented
});

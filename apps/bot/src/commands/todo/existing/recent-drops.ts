import { SlashCommandBuilder } from "discord.js";

import { defineCommand } from "@/utils/commands";
import { replyNotImplemented } from "@/utils/replies";

export const recentDrops = defineCommand({
  data: new SlashCommandBuilder().setName("recent_drops").setDescription("See the latest drops"),
  category: "Records",
  execute: replyNotImplemented
});

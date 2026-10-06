import { SlashCommandBuilder } from "discord.js";

import { defineCommand } from "@/utils/commands";
import { replyNotImplemented } from "@/utils/replies";

export const adminVcPeep = defineCommand({
  data: new SlashCommandBuilder().setName("admin_vc_peep").setDescription("See anyone's time in voice channels"),
  category: "Voice",
  admin: true,
  execute: replyNotImplemented
});

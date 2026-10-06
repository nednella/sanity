import { SlashCommandBuilder } from "discord.js";

import { defineCommand } from "@/utils/commands";
import { replyNotImplemented } from "@/utils/replies";

export const vcstats = defineCommand({
  data: new SlashCommandBuilder().setName("vcstats").setDescription("See your time in voice channels"),
  category: "Voice",
  execute: replyNotImplemented
});

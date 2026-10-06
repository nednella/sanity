import { SlashCommandBuilder } from "discord.js";

import { defineCommand } from "@/utils/commands";
import { replyNotImplemented } from "@/utils/replies";

export const personalBests = defineCommand({
  data: new SlashCommandBuilder().setName("personal_bests").setDescription("See personal bests"),
  category: "Records",
  execute: replyNotImplemented
});

import { SlashCommandBuilder } from "discord.js";

import { defineCommand } from "@/utils/commands";
import { replyNotImplemented } from "@/utils/replies";

export const diary = defineCommand({
  data: new SlashCommandBuilder().setName("diary").setDescription("See a member's speedrun diary"),
  category: "Records",
  execute: replyNotImplemented
});

import { SlashCommandBuilder } from "discord.js";

import { defineCommand } from "@/utils/commands";
import { replyNotImplemented } from "@/utils/replies";

export const compMode = defineCommand({
  data: new SlashCommandBuilder().setName("comp_mode").setDescription("Switch bingo mode on or off"),
  category: "Events",
  admin: true,
  execute: replyNotImplemented
});

import { SlashCommandBuilder } from "discord.js";

import { defineCommand } from "@/utils/commands";
import { replyNotImplemented } from "@/utils/replies";

export const addChannel = defineCommand({
  data: new SlashCommandBuilder().setName("add_channel").setDescription("Register a channel the bot posts in"),
  category: "Setup",
  admin: true,
  execute: replyNotImplemented
});

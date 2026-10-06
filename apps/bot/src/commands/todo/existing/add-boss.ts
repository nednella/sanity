import { SlashCommandBuilder } from "discord.js";

import { defineCommand } from "@/utils/commands";
import { replyNotImplemented } from "@/utils/replies";

export const addBoss = defineCommand({
  data: new SlashCommandBuilder().setName("add_boss").setDescription("Add a boss"),
  category: "Catalogue",
  admin: true,
  execute: replyNotImplemented
});

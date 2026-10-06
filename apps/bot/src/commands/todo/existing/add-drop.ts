import { SlashCommandBuilder } from "discord.js";

import { defineCommand } from "@/utils/commands";
import { replyNotImplemented } from "@/utils/replies";

export const addDrop = defineCommand({
  data: new SlashCommandBuilder().setName("add_drop").setDescription("Add a drop"),
  category: "Catalogue",
  admin: true,
  execute: replyNotImplemented
});

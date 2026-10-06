import { SlashCommandBuilder } from "discord.js";

import { defineCommand } from "@/utils/commands";
import { replyNotImplemented } from "@/utils/replies";

export const removeDrop = defineCommand({
  data: new SlashCommandBuilder().setName("remove_drop").setDescription("Remove a drop"),
  category: "Catalogue",
  admin: true,
  execute: replyNotImplemented
});

import { SlashCommandBuilder } from "discord.js";

import { defineCommand } from "@/utils/commands";
import { replyNotImplemented } from "@/utils/replies";

export const updateDropValue = defineCommand({
  data: new SlashCommandBuilder().setName("update_drop_value").setDescription("Set the minimum value of a drop"),
  category: "Catalogue",
  admin: true,
  execute: replyNotImplemented
});

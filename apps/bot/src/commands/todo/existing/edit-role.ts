import { SlashCommandBuilder } from "discord.js";

import { defineCommand } from "@/utils/commands";
import { replyNotImplemented } from "@/utils/replies";

export const editRole = defineCommand({
  data: new SlashCommandBuilder().setName("edit_role").setDescription("Edit a role's permissions"),
  category: "Roles",
  admin: true,
  execute: replyNotImplemented
});

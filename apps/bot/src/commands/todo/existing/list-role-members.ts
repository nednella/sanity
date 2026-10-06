import { SlashCommandBuilder } from "discord.js";

import { defineCommand } from "@/utils/commands";
import { replyNotImplemented } from "@/utils/replies";

export const listRoleMembers = defineCommand({
  data: new SlashCommandBuilder().setName("list_role_members").setDescription("List the members holding a role"),
  category: "Roles",
  admin: true,
  execute: replyNotImplemented
});

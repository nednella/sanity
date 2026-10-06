import { SlashCommandBuilder } from "discord.js";

import { defineCommand } from "@/utils/commands";
import { replyNotImplemented } from "@/utils/replies";

export const updateJoinDate = defineCommand({
  data: new SlashCommandBuilder().setName("update_join_date").setDescription("Correct a member's join date"),
  category: "Membership",
  admin: true,
  execute: replyNotImplemented
});

import { SlashCommandBuilder } from "discord.js";

import { defineCommand } from "@/utils/commands";
import { replyNotImplemented } from "@/utils/replies";

export const rank = defineCommand({
  data: new SlashCommandBuilder().setName("rank").setDescription("Set a member's rank by hand"),
  category: "Membership",
  admin: true,
  execute: replyNotImplemented
});

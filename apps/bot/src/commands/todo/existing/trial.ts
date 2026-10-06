import { SlashCommandBuilder } from "discord.js";

import { defineCommand } from "@/utils/commands";
import { replyNotImplemented } from "@/utils/replies";

export const trial = defineCommand({
  data: new SlashCommandBuilder().setName("trial").setDescription("Start a member's trial"),
  category: "Membership",
  admin: true,
  execute: replyNotImplemented
});

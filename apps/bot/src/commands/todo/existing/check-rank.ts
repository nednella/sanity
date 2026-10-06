import { SlashCommandBuilder } from "discord.js";

import { defineCommand } from "@/utils/commands";
import { replyNotImplemented } from "@/utils/replies";

export const checkRank = defineCommand({
  data: new SlashCommandBuilder()
    .setName("check_rank")
    .setDescription("Check every member for the rank they have earned"),
  category: "Membership",
  admin: true,
  execute: replyNotImplemented
});

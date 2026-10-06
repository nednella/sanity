import { SlashCommandBuilder } from "discord.js";

import { defineCommand } from "@/utils/commands";
import { replyNotImplemented } from "@/utils/replies";

export const eventWinnerRole = defineCommand({
  data: new SlashCommandBuilder()
    .setName("event_winner_role")
    .setDescription("Give an event winner their bonus for a while"),
  category: "Points",
  admin: true,
  execute: replyNotImplemented
});

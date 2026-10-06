import { SlashCommandBuilder } from "discord.js";

import { defineCommand } from "@/utils/commands";
import { replyNotImplemented } from "@/utils/replies";

export const updatePb = defineCommand({
  data: new SlashCommandBuilder()
    .setName("update_pb")
    .setDescription("Correct a personal best that was already submitted"),
  category: "Submissions",
  admin: true,
  execute: replyNotImplemented
});

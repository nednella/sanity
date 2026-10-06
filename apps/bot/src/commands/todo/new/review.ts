import { SlashCommandBuilder } from "discord.js";

import { defineCommand } from "@/utils/commands";
import { replyNotImplemented } from "@/utils/replies";

export const review = defineCommand({
  data: new SlashCommandBuilder().setName("review").setDescription("Approve or deny a submission"),
  category: "Submissions",
  admin: true,
  execute: replyNotImplemented
});

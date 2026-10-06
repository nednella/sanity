import { SlashCommandBuilder } from "discord.js";

import { defineCommand } from "@/utils/commands";
import { replyNotImplemented } from "@/utils/replies";

export const pbSubmission = defineCommand({
  data: new SlashCommandBuilder().setName("pb_submission").setDescription("Submit a personal best"),
  category: "Submissions",
  execute: replyNotImplemented
});

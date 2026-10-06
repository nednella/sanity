import { SlashCommandBuilder } from "discord.js";

import { defineCommand } from "@/utils/commands";
import { replyNotImplemented } from "@/utils/replies";

export const submit = defineCommand({
  data: new SlashCommandBuilder().setName("submit").setDescription("Submit a drop"),
  category: "Submissions",
  execute: replyNotImplemented
});

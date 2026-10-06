import { SlashCommandBuilder } from "discord.js";

import { defineCommand } from "@/utils/commands";
import { replyNotImplemented } from "@/utils/replies";

export const ironSubmit = defineCommand({
  data: new SlashCommandBuilder().setName("iron_submit").setDescription("Submit an ironman drop"),
  category: "Submissions",
  execute: replyNotImplemented
});

import { SlashCommandBuilder } from "discord.js";

import { defineCommand } from "@/utils/commands";
import { replyNotImplemented } from "@/utils/replies";

export const bingoSubmit = defineCommand({
  data: new SlashCommandBuilder().setName("bingo_submit").setDescription("Submit a bingo drop"),
  category: "Submissions",
  execute: replyNotImplemented
});

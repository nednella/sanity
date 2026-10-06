import { SlashCommandBuilder } from "discord.js";

import { defineCommand } from "@/utils/commands";
import { replyNotImplemented } from "@/utils/replies";

export const leagueSubmit = defineCommand({
  data: new SlashCommandBuilder().setName("league_submit").setDescription("Submit a leagues drop"),
  category: "Submissions",
  execute: replyNotImplemented
});

import { SlashCommandBuilder } from "discord.js";

import { defineCommand } from "@/utils/commands";
import { replyNotImplemented } from "@/utils/replies";

export const topDeaths = defineCommand({
  data: new SlashCommandBuilder().setName("top_deaths").setDescription("See who dies the most"),
  category: "Deaths",
  execute: replyNotImplemented
});

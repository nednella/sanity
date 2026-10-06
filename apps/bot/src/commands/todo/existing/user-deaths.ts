import { SlashCommandBuilder } from "discord.js";

import { defineCommand } from "@/utils/commands";
import { replyNotImplemented } from "@/utils/replies";

export const userDeaths = defineCommand({
  data: new SlashCommandBuilder().setName("user_deaths").setDescription("See a member's deaths"),
  category: "Deaths",
  execute: replyNotImplemented
});

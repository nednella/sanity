import { SlashCommandBuilder } from "discord.js";

import { handleHelp } from "@/handlers/help";
import { defineCommand } from "@/utils/commands";

export const help = defineCommand({
  data: new SlashCommandBuilder().setName("help").setDescription("Learn how to interact with the Sanity Mainframe"),
  category: "General",
  ephemeral: true,
  execute: handleHelp
});

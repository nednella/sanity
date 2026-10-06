import { SlashCommandBuilder } from "discord.js";

import { defineCommand } from "@/utils/commands";

import { handleHelp } from "./handler";

export const help = defineCommand({
  data: new SlashCommandBuilder().setName("help").setDescription("Learn how to interact with the Sanity Mainframe"),
  category: "General",
  selfOnly: true,
  execute: handleHelp
});

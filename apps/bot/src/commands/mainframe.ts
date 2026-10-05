import { SlashCommandBuilder } from "discord.js";

import { handleMainframe } from "@/handlers/mainframe";
import { defineCommand } from "@/utils/commands";

export const mainframe = defineCommand({
  data: new SlashCommandBuilder().setName("mainframe").setDescription("Check the mainframe is alive"),
  category: "Health",
  execute: handleMainframe
});

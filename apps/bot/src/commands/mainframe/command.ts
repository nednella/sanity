import { SlashCommandBuilder } from "discord.js";

import { defineCommand } from "@/utils/commands";

import { handleMainframe } from "./handler";

export const mainframe = defineCommand({
  data: new SlashCommandBuilder().setName("mainframe").setDescription("Check the mainframe is alive"),
  category: "Health",
  admin: true,
  execute: handleMainframe
});

import { SlashCommandBuilder } from "discord.js";

import { defineCommand } from "@/utils/commands";

import { handlePluginKey } from "./handler";

export const pluginKey = defineCommand({
  data: new SlashCommandBuilder().setName("plugin-key").setDescription("Get a new key for the Sanity RuneLite plugin"),
  category: "Mainframe",
  selfOnly: true,
  execute: handlePluginKey
});

import { SlashCommandBuilder } from "discord.js";

import { defineCommand } from "@/utils/commands";

import { handleHealth } from "./handler";

export const health = defineCommand({
  data: new SlashCommandBuilder().setName("health").setDescription("Check the mainframe is alive"),
  category: "Health",
  admin: true,
  execute: handleHealth
});

import { SlashCommandBuilder } from "discord.js";

import { defineCommand } from "@/utils/commands";

import { handleAdminHelp, handleHelp } from "./handler";

const CMD_DESCRIPTION = "Learn how to interact with the Sanity Mainframe";

export const adminHelp = defineCommand({
  data: new SlashCommandBuilder().setName("admin_help").setDescription(CMD_DESCRIPTION),
  category: "General",
  admin: true,
  selfOnly: true,
  execute: handleAdminHelp
});

export const help = defineCommand({
  data: new SlashCommandBuilder().setName("help").setDescription(CMD_DESCRIPTION),
  category: "General",
  selfOnly: true,
  execute: handleHelp
});

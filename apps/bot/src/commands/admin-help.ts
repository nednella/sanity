import { SlashCommandBuilder } from "discord.js";

import { handleAdminHelp } from "@/handlers/help";
import { defineCommand } from "@/utils/commands";

export const adminHelp = defineCommand({
  data: new SlashCommandBuilder()
    .setName("admin_help")
    .setDescription("Learn how to interact with the Sanity Mainframe"),
  category: "General",
  admin: true,
  selfOnly: true,
  execute: handleAdminHelp
});

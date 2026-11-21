import { SlashCommandBuilder } from "discord.js";

import { handleAdminHelp } from "@/commands/public/help/handler";
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

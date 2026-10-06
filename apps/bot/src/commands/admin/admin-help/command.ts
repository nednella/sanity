import { SlashCommandBuilder } from "discord.js";

import { defineCommand } from "@/utils/commands";

import { handleAdminHelp } from "../../public/help/handler";

export const adminHelp = defineCommand({
  data: new SlashCommandBuilder()
    .setName("admin_help")
    .setDescription("Learn how to interact with the Sanity Mainframe"),
  category: "General",
  admin: true,
  selfOnly: true,
  execute: handleAdminHelp
});

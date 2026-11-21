import { SlashCommandBuilder } from "discord.js";

import { membersOption, noteOption } from "@/commands/admin/member/utils";
import { defineCommand } from "@/utils/commands";

import { handleAdmin } from "./handler";

export const admin = defineCommand({
  data: new SlashCommandBuilder()
    .setName("admin")
    .setDescription("Manage who has the administrator role")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("add")
        .setDescription("Create new admins")
        .addStringOption(membersOption)
        .addStringOption(noteOption)
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("remove")
        .setDescription("Remove existing admins")
        .addStringOption(membersOption)
        .addStringOption(noteOption)
    ),
  category: "Admin",
  admin: true,
  execute: handleAdmin
});

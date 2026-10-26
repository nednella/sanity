import { SlashCommandBuilder } from "discord.js";

import { defineCommand } from "@/utils/commands";

import { membersOption, noteOption } from "../member/utils";
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
  category: "Membership",
  admin: true,
  execute: handleAdmin
});

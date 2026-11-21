import { SlashCommandBuilder } from "discord.js";

import { membersOption, noteOption } from "@/commands/admin/member/utils";
import { defineCommand } from "@/utils/commands";

import { handlePlugin } from "./handler";

export const plugin = defineCommand({
  data: new SlashCommandBuilder()
    .setName("plugin")
    .setDescription("Manage who can use the RuneLite plugin")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("revoke")
        .setDescription("Revoke members' plugin access and their keys")
        .addStringOption(membersOption)
        .addStringOption(noteOption)
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("reinstate")
        .setDescription("Reinstate plugin access to members")
        .addStringOption(membersOption)
        .addStringOption(noteOption)
    ),
  category: "Plugin",
  admin: true,
  execute: handlePlugin
});

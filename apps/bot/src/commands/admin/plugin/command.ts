import { SlashCommandBuilder } from "discord.js";

import { defineCommand } from "@/utils/commands";

import { membersOption, noteOption } from "../member/utils";
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
  category: "Membership",
  admin: true,
  execute: handlePlugin
});

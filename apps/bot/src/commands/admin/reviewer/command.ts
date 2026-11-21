import { SlashCommandBuilder } from "discord.js";

import { membersOption, noteOption } from "@/commands/admin/member/utils";
import { defineCommand } from "@/utils/commands";

import { handleReviewer } from "./handler";

export const reviewer = defineCommand({
  data: new SlashCommandBuilder()
    .setName("reviewer")
    .setDescription("Manage who can review submissions and personal bests")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("add")
        .setDescription("Create new reviewers")
        .addStringOption(membersOption)
        .addStringOption(noteOption)
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("remove")
        .setDescription("Remove existing reviewers")
        .addStringOption(membersOption)
        .addStringOption(noteOption)
    ),
  category: "Admin",
  admin: true,
  execute: handleReviewer
});

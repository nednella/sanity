import { SlashCommandBuilder } from "discord.js";

import { defineCommand } from "@/utils/commands";

import { membersOption, noteOption } from "../member/utils";
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
  category: "Membership",
  admin: true,
  execute: handleReviewer
});

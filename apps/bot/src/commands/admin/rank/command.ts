import { SlashCommandBuilder } from "discord.js";

import { defineCommand } from "@/utils/commands";

import { membersOption, noteOption } from "../member/utils";
import { handleRank } from "./handler";

export const rank = defineCommand({
  data: new SlashCommandBuilder()
    .setName("rank")
    .setDescription("Manage clan member ranks")
    .addSubcommand((subcommand) =>
      subcommand.setName("check").setDescription("Check if any members are due a rank promotion or demotion")
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("hold_demotion")
        .setDescription("Hold members' demotions until next month")
        .addStringOption(membersOption)
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("set")
        .setDescription("Update a members' rank manually")
        .addStringOption(membersOption)
        .addStringOption((option) => option.setName("rank").setDescription("The rank's name").setRequired(true))
        .addStringOption(noteOption)
    ),
  category: "Membership",
  admin: true,
  execute: handleRank
});

import { SlashCommandBuilder } from "discord.js";

import { defineCommand } from "@/utils/commands";
import { membersOption, noteOption } from "@/utils/member-commands";

import { handleRank } from "./handler";

export const rank = defineCommand({
  data: new SlashCommandBuilder()
    .setName("rank")
    .setDescription("Set a member's rank by hand")
    .addStringOption(membersOption)
    .addStringOption((option) => option.setName("rank").setDescription("The rank's name").setRequired(true))
    .addStringOption(noteOption),
  category: "Membership",
  admin: true,
  execute: handleRank
});

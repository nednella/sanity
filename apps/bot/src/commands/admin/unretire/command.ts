import { SlashCommandBuilder } from "discord.js";

import { defineCommand } from "@/utils/commands";
import { membersOption, noteOption } from "@/utils/member-commands";

import { handleUnretire } from "./handler";

export const unretire = defineCommand({
  data: new SlashCommandBuilder()
    .setName("unretire")
    .setDescription("Bring a retired member back")
    .addStringOption(membersOption)
    .addStringOption(noteOption),
  category: "Membership",
  admin: true,
  execute: handleUnretire
});

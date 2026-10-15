import { SlashCommandBuilder } from "discord.js";

import { defineCommand } from "@/utils/commands";
import { membersOption, noteOption } from "@/utils/member-commands";

import { handlePassTrial } from "./handler";

export const passTrial = defineCommand({
  data: new SlashCommandBuilder()
    .setName("pass_trial")
    .setDescription("Pass a trialist")
    .addStringOption(membersOption)
    .addStringOption(noteOption),
  category: "Membership",
  admin: true,
  execute: handlePassTrial
});

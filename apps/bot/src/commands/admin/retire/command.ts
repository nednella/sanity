import { SlashCommandBuilder } from "discord.js";

import { defineCommand } from "@/utils/commands";
import { membersOption, noteOption } from "@/utils/member-commands";

import { handleRetire } from "./handler";

export const retire = defineCommand({
  data: new SlashCommandBuilder()
    .setName("retire")
    .setDescription("Retire a member")
    .addStringOption(membersOption)
    .addStringOption(noteOption),
  category: "Membership",
  admin: true,
  execute: handleRetire
});

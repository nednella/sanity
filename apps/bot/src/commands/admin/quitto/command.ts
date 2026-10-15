import { SlashCommandBuilder } from "discord.js";

import { defineCommand } from "@/utils/commands";
import { membersOption, noteOption } from "@/utils/member-commands";

import { handleQuitto } from "./handler";

export const quitto = defineCommand({
  data: new SlashCommandBuilder()
    .setName("quitto")
    .setDescription("Remove a member from the clan")
    .addStringOption(membersOption)
    .addStringOption(noteOption),
  category: "Membership",
  admin: true,
  execute: handleQuitto
});

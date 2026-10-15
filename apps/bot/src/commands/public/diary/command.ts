import { SlashCommandBuilder } from "discord.js";

import { defineCommand } from "@/utils/commands";

import { handleDiary } from "./handler";

export const diary = defineCommand({
  data: new SlashCommandBuilder()
    .setName("diary")
    .setDescription("See a member's speedrun diary")
    .addUserOption((option) => option.setName("member").setDescription("Who to look up; you by default")),
  category: "Records",
  execute: handleDiary
});

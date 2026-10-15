import { SlashCommandBuilder } from "discord.js";

import { defineCommand } from "@/utils/commands";

import { handleAge } from "./handler";

export const age = defineCommand({
  data: new SlashCommandBuilder()
    .setName("age")
    .setDescription("See how long someone has been in the clan")
    .addUserOption((option) => option.setName("member").setDescription("Who to look up; you by default")),
  category: "Profile",
  execute: handleAge
});

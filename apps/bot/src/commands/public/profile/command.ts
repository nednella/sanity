import { SlashCommandBuilder } from "discord.js";

import { defineCommand } from "@/utils/commands";

import { handleProfile } from "./handler";

export const profile = defineCommand({
  data: new SlashCommandBuilder()
    .setName("profile")
    .setDescription("Show a member's profile")
    .addUserOption((option) => option.setName("member").setDescription("Who to look up; you by default")),
  category: "Profile",
  execute: handleProfile
});

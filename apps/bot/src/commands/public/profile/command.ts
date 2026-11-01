import { SlashCommandBuilder } from "discord.js";

import { defineCommand } from "@/utils/commands";
import { oneMemberOption } from "@/utils/members";

import { handleProfile } from "./handler";

export const profile = defineCommand({
  data: new SlashCommandBuilder()
    .setName("profile")
    .setDescription("Show a member's profile")
    .addUserOption(oneMemberOption),
  category: "Profile",
  execute: handleProfile
});

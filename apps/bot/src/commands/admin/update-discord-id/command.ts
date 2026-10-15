import { SlashCommandBuilder } from "discord.js";

import { defineCommand } from "@/utils/commands";

import { handleUpdateDiscordId } from "./handler";

export const updateDiscordId = defineCommand({
  data: new SlashCommandBuilder()
    .setName("update_discord_id")
    .setDescription("Move a member to a new Discord account")
    .addStringOption((option) =>
      option.setName("name").setDescription("The member's name in the clan").setRequired(true).setMaxLength(32)
    )
    .addUserOption((option) => option.setName("account").setDescription("Tag the new account").setRequired(true)),
  category: "Membership",
  admin: true,
  execute: handleUpdateDiscordId
});

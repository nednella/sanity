import { SlashCommandBuilder } from "discord.js";

import { defineCommand } from "@/utils/commands";
import { replyNotImplemented } from "@/utils/replies";

export const updateDiscordId = defineCommand({
  data: new SlashCommandBuilder().setName("update_discord_id").setDescription("Move a member to a new Discord account"),
  category: "Membership",
  admin: true,
  execute: replyNotImplemented
});

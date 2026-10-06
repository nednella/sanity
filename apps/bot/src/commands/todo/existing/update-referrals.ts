import { SlashCommandBuilder } from "discord.js";

import { defineCommand } from "@/utils/commands";
import { replyNotImplemented } from "@/utils/replies";

export const updateReferrals = defineCommand({
  data: new SlashCommandBuilder().setName("update_referrals").setDescription("Correct who referred a member"),
  category: "Membership",
  admin: true,
  execute: replyNotImplemented
});

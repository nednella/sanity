import { SlashCommandBuilder } from "discord.js";

import { defineCommand } from "@/utils/commands";
import { replyNotImplemented } from "@/utils/replies";

export const passTrial = defineCommand({
  data: new SlashCommandBuilder().setName("pass_trial").setDescription("Pass a trialist"),
  category: "Membership",
  admin: true,
  execute: replyNotImplemented
});

import { SlashCommandBuilder } from "discord.js";

import { defineCommand } from "@/utils/commands";
import { replyNotImplemented } from "@/utils/replies";

export const retire = defineCommand({
  data: new SlashCommandBuilder().setName("retire").setDescription("Retire a member"),
  category: "Membership",
  admin: true,
  execute: replyNotImplemented
});

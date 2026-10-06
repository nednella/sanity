import { SlashCommandBuilder } from "discord.js";

import { defineCommand } from "@/utils/commands";
import { replyNotImplemented } from "@/utils/replies";

export const quitto = defineCommand({
  data: new SlashCommandBuilder().setName("quitto").setDescription("Remove a member from the clan"),
  category: "Membership",
  admin: true,
  execute: replyNotImplemented
});

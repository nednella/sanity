import { SlashCommandBuilder } from "discord.js";

import { defineCommand } from "@/utils/commands";
import { replyNotImplemented } from "@/utils/replies";

export const unretire = defineCommand({
  data: new SlashCommandBuilder().setName("unretire").setDescription("Bring a retired member back"),
  category: "Membership",
  admin: true,
  execute: replyNotImplemented
});

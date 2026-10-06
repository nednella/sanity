import { SlashCommandBuilder } from "discord.js";

import { defineCommand } from "@/utils/commands";
import { replyNotImplemented } from "@/utils/replies";

export const addPoints = defineCommand({
  data: new SlashCommandBuilder().setName("add_points").setDescription("Award or deduct clan points by hand"),
  category: "Points",
  admin: true,
  execute: replyNotImplemented
});

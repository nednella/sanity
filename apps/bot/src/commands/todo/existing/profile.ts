import { SlashCommandBuilder } from "discord.js";

import { defineCommand } from "@/utils/commands";
import { replyNotImplemented } from "@/utils/replies";

export const profile = defineCommand({
  data: new SlashCommandBuilder().setName("profile").setDescription("Show a member's profile"),
  category: "Profile",
  execute: replyNotImplemented
});

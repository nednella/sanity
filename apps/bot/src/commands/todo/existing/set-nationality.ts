import { SlashCommandBuilder } from "discord.js";

import { defineCommand } from "@/utils/commands";
import { replyNotImplemented } from "@/utils/replies";

export const setNationality = defineCommand({
  data: new SlashCommandBuilder().setName("set_nationality").setDescription("Set the flag shown on your profile"),
  category: "Profile",
  execute: replyNotImplemented
});

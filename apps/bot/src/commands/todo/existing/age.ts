import { SlashCommandBuilder } from "discord.js";

import { defineCommand } from "@/utils/commands";
import { replyNotImplemented } from "@/utils/replies";

export const age = defineCommand({
  data: new SlashCommandBuilder().setName("age").setDescription("See how long someone has been in the clan"),
  category: "Profile",
  execute: replyNotImplemented
});

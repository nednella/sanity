import { SlashCommandBuilder } from "discord.js";

import { defineCommand } from "@/utils/commands";
import { replyNotImplemented } from "@/utils/replies";

export const changeRsn = defineCommand({
  data: new SlashCommandBuilder().setName("change_rsn").setDescription("Change your main or alt RSN"),
  category: "Profile",
  execute: replyNotImplemented
});

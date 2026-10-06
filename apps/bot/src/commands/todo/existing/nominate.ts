import { SlashCommandBuilder } from "discord.js";

import { defineCommand } from "@/utils/commands";
import { replyNotImplemented } from "@/utils/replies";

export const nominate = defineCommand({
  data: new SlashCommandBuilder().setName("nominate").setDescription("Nominate someone for the Sanity awards"),
  category: "Events",
  execute: replyNotImplemented
});

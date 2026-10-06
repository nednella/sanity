import { SlashCommandBuilder } from "discord.js";

import { defineCommand } from "@/utils/commands";
import { replyNotImplemented } from "@/utils/replies";

export const createVote = defineCommand({
  data: new SlashCommandBuilder().setName("create_vote").setDescription("Open a vote for the Sanity awards"),
  category: "Events",
  admin: true,
  execute: replyNotImplemented
});

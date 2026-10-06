import { SlashCommandBuilder } from "discord.js";

import { defineCommand } from "@/utils/commands";
import { replyNotImplemented } from "@/utils/replies";

export const pointsGraph = defineCommand({
  data: new SlashCommandBuilder().setName("points_graph").setDescription("See a member's points over time"),
  category: "Records",
  execute: replyNotImplemented
});

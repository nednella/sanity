import { SlashCommandBuilder } from "discord.js";

import { defineCommand } from "@/utils/commands";
import { replyNotImplemented } from "@/utils/replies";

export const ranksGracePeriod = defineCommand({
  data: new SlashCommandBuilder()
    .setName("ranks_grace_period")
    .setDescription("Hold a member's demotion until next month"),
  category: "Membership",
  admin: true,
  execute: replyNotImplemented
});

import { SlashCommandBuilder } from "discord.js";

import { defineCommand } from "@/utils/commands";
import { membersOption } from "@/utils/member-commands";

import { handleRanksGracePeriod } from "./handler";

export const ranksGracePeriod = defineCommand({
  data: new SlashCommandBuilder()
    .setName("ranks_grace_period")
    .setDescription("Hold a member's demotion until next month")
    .addStringOption(membersOption),
  category: "Membership",
  admin: true,
  execute: handleRanksGracePeriod
});

import { SlashCommandBuilder } from "discord.js";

import { handlePing } from "@/handlers/ping";
import { defineCommand } from "@/utils/commands";

export const ping = defineCommand({
  data: new SlashCommandBuilder().setName("ping").setDescription("Check the bot is alive"),
  category: "Health",
  execute: handlePing
});

import { SlashCommandBuilder } from "discord.js";

import { defineCommand } from "@/utils/commands";

export const ping = defineCommand(
  new SlashCommandBuilder().setName("ping").setDescription("Check the bot is alive"),
  (interaction) => interaction.reply("I'm alive mate")
);

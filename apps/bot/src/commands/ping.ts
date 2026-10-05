import { type ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";

import { defineCommand } from "@/utils/commands";

export const ping = defineCommand({
  data: new SlashCommandBuilder().setName("ping").setDescription("Check the bot is alive"),
  category: "Health",
  execute: handlePing
});

function handlePing(interaction: ChatInputCommandInteraction) {
  return interaction.reply("I'm alive mate");
}

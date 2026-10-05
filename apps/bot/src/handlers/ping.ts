import type { ChatInputCommandInteraction } from "discord.js";

export const handlePing = (interaction: ChatInputCommandInteraction) => interaction.reply("I'm alive mate");

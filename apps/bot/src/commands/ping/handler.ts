import type { ChatInputCommandInteraction } from "discord.js";

export const handlePing = (interaction: ChatInputCommandInteraction) => interaction.editReply("I'm alive mate");

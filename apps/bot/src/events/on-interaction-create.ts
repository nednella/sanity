import { type Interaction, MessageFlags } from "discord.js";

import { commands } from "@/commands";
import { logger } from "@/lib/logger";

export const onInteractionCreate = async (interaction: Interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const command = commands.get(interaction.commandName);
  if (!command) {
    logger.warn(`no handler for /${interaction.commandName}`);
    return;
  }

  try {
    await interaction.deferReply({ flags: command.ephemeral ? MessageFlags.Ephemeral : undefined });
    await command.execute(interaction);
  } catch (error) {
    logger.error(error, `/${interaction.commandName} failed`);
    const content = "Something went wrong. Please try again later.";
    await (interaction.replied || interaction.deferred ? interaction.editReply(content) : interaction.reply(content));
  }
};

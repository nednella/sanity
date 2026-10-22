import { type Interaction, MessageFlags } from "discord.js";

import { commands } from "@/commands";
import { logger } from "@/lib/logger";
import { handleCommandInteractionError } from "@/utils/errors";

export const onInteractionCreate = async (interaction: Interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const command = commands.get(interaction.commandName);
  if (!command) {
    logger.warn(`no registered handler for /${interaction.commandName}`);
    return;
  }

  try {
    await interaction.deferReply({ flags: command.selfOnly ? MessageFlags.Ephemeral : undefined });
    await command.execute(interaction);
  } catch (error) {
    await handleCommandInteractionError(interaction, error);
  }
};

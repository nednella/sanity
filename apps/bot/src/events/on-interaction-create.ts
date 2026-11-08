import { type AutocompleteInteraction, type Interaction, MessageFlags } from "discord.js";

import { commands } from "@/commands";
import { runAsDiscordUserId } from "@/lib/api";
import { logger } from "@/lib/logger";
import { handleCommandInteractionError } from "@/utils/errors";

const onAutocomplete = async (interaction: AutocompleteInteraction) => {
  try {
    await commands.get(interaction.commandName)?.autocomplete?.(interaction);
  } catch (error) {
    logger.error(error, `/${interaction.commandName} autocomplete failed`);
  }
};

export const onInteractionCreate = async (interaction: Interaction) => {
  if (interaction.isAutocomplete()) return onAutocomplete(interaction);
  if (!interaction.isChatInputCommand()) return;

  const command = commands.get(interaction.commandName);
  if (!command) {
    logger.warn(`no registered handler for /${interaction.commandName}`);
    return;
  }

  try {
    await interaction.deferReply({ flags: command.selfOnly ? MessageFlags.Ephemeral : undefined });
    await runAsDiscordUserId(interaction.user.id, () => command.execute(interaction));
  } catch (error) {
    await handleCommandInteractionError(interaction, error);
  }
};

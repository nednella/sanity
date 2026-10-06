import { type Interaction, MessageFlags } from "discord.js";

import { NetworkError } from "@sanity/api";

import { commands } from "@/commands";
import { logger } from "@/lib/logger";
import { replyError } from "@/utils/replies";

const describe = (error: unknown) =>
  error instanceof NetworkError
    ? "The mainframe did not answer. Please try again in a moment."
    : "Something went wrong. Please try again later.";

export const onInteractionCreate = async (interaction: Interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const command = commands.get(interaction.commandName);
  if (!command) {
    logger.warn(`no handler for /${interaction.commandName}`);
    return;
  }

  try {
    await interaction.deferReply({ flags: command.selfOnly ? MessageFlags.Ephemeral : undefined });
    await command.execute(interaction);
  } catch (error) {
    logger.error(error, `/${interaction.commandName} failed`);
    await replyError(interaction, describe(error));
  }
};

import { type Interaction, MessageFlags, inlineCode } from "discord.js";

import { NetworkError } from "@sanity/api";

import { commands } from "@/commands";
import { CHANNELS, ChannelNotSetError, type ChannelType } from "@/lib/channels";
import { logger } from "@/lib/logger";
import { replyError } from "@/utils/replies";

const NOUNS: Record<ChannelType, string> = {
  category: "category",
  text: "channel",
  voice: "voice channel"
};

const describe = (error: unknown) => {
  if (error instanceof NetworkError) {
    return {
      title: "Mainframe offline",
      description: "The mainframe did not answer. Please try again in a moment."
    };
  }
  if (error instanceof ChannelNotSetError) {
    const { label, type } = CHANNELS[error.purpose];
    return {
      title: `${label} ${NOUNS[type]} is not set`,
      description: `An admin can set it with ${inlineCode(`/channels set ${type}`)}.`
    };
  }
  return {
    title: "Something went wrong",
    description: "Please try again later."
  };
};

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

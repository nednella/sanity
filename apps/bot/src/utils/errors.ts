import { type ChatInputCommandInteraction, inlineCode } from "discord.js";

import { ApiError, NetworkError } from "@sanity/api";

import { CHANNELS, type ChannelType, ChannelUnavailableError } from "@/lib/channels";
import { logger } from "@/lib/logger";

import { replyError } from "./replies";

const NOUNS: Record<ChannelType, string> = {
  category: "category",
  text: "text channel",
  voice: "voice channel"
};

const describeChannelUnavailableError = ({ missingPermissions, purpose, reason }: ChannelUnavailableError) => {
  const { label, type } = CHANNELS[purpose];
  const name = `${label} ${NOUNS[type]}`;
  const setIt = `An admin can set it with ${inlineCode(`/channels set ${type}`)}.`;

  if (reason === "not-set") return { title: `${name} is not set`, description: setIt };
  if (reason === "missing") {
    return { title: `${name} is missing`, description: `It was deleted or is the wrong type. ${setIt}` };
  }
  return {
    title: `I cannot use the ${name}`,
    description: `I need ${missingPermissions.map((permission) => inlineCode(permission)).join(", ")} there.`
  };
};

const describeApiError = ({ code, message, status }: ApiError) => {
  return {
    title: "Server Error",
    description: `${inlineCode(code ?? `HTTP ${status}`)}\n${message}`
  };
};

const describeNetworkError = () => {
  return {
    title: "Mainframe offline",
    description: "The mainframe did not answer. Please try again in a moment."
  };
};

const describeUnexpectedError = () => {
  return {
    title: "Something went wrong",
    description: "Please try again later."
  };
};

const describeError = (error: unknown) => {
  if (error instanceof ChannelUnavailableError) return describeChannelUnavailableError(error);
  if (error instanceof ApiError) return describeApiError(error);
  if (error instanceof NetworkError) return describeNetworkError();
  return describeUnexpectedError();
};

export const handleCommandInteractionError = async (interaction: ChatInputCommandInteraction, error: unknown) => {
  logger.error(error, `/${interaction.commandName} failed`);
  await replyError(interaction, describeError(error));
};

import type { ChatInputCommandInteraction } from "discord.js";

import { ApiError } from "@sanity/api";
import { formatDate } from "@sanity/utils";

import { api } from "@/lib/api";
import { runSubcommand } from "@/utils/commands";
import { buildEmbed } from "@/utils/embeds";
import { reply, replyError } from "@/utils/replies";

const pad = (value: number) => String(value).padStart(2, "0");

const replyChanged = (interaction: ChatInputCommandInteraction, title: string, description: string) =>
  reply(interaction, buildEmbed({ style: "success", title, description }));

const setBirthday = async (interaction: ChatInputCommandInteraction) => {
  const day = interaction.options.getInteger("day", true);
  const month = interaction.options.getInteger("month", true);
  const year = interaction.options.getInteger("year", true);
  const birthday = `${year}-${pad(month)}-${pad(day)}`;

  try {
    await api.patch("/v1/members/me", { body: { birthday } });
  } catch (error) {
    if (!(error instanceof ApiError && error.status === 400)) throw error;
    return replyError(interaction, { title: "Invalid date", description: "That date does not exist." });
  }

  return replyChanged(interaction, "Birthday changed", `Your birthday is now ${formatDate(birthday)}.`);
};

const removeBirthday = async (interaction: ChatInputCommandInteraction) => {
  await api.patch("/v1/members/me", { body: { birthday: null } });
  return replyChanged(interaction, "Birthday removed", "You no longer have a birthday set.");
};

const SUBCOMMANDS = {
  remove: removeBirthday,
  set: setBirthday
};

export const handleBirthday = (interaction: ChatInputCommandInteraction) => runSubcommand(interaction, SUBCOMMANDS);

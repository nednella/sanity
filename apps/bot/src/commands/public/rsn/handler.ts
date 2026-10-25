import { type ChatInputCommandInteraction, inlineCode } from "discord.js";

import { api } from "@/lib/api";
import { runSubcommand } from "@/utils/commands";
import { buildEmbed } from "@/utils/embeds";
import { reply } from "@/utils/replies";

const replyChanged = (interaction: ChatInputCommandInteraction, description: string) =>
  reply(interaction, buildEmbed({ style: "success", title: "RSN changed", description }));

const setAlt = async (interaction: ChatInputCommandInteraction) => {
  const altRsn = interaction.options.getString("name", true);
  await api.patch("/v1/members/me", { body: { altRsn } });
  return replyChanged(interaction, `Your alt RSN is now ${inlineCode(altRsn)}.`);
};

const setMain = async (interaction: ChatInputCommandInteraction) => {
  const mainRsn = interaction.options.getString("name", true);
  await api.patch("/v1/members/me", { body: { mainRsn } });
  return replyChanged(interaction, `Your main RSN is now ${inlineCode(mainRsn)}.`);
};

const unsetAlt = async (interaction: ChatInputCommandInteraction) => {
  await api.patch("/v1/members/me", { body: { altRsn: null } });
  return replyChanged(interaction, "You no longer have an alt RSN.");
};

const SUBCOMMANDS = {
  "set alt": setAlt,
  "set main": setMain,
  "unset alt": unsetAlt
};

export const handleRsn = (interaction: ChatInputCommandInteraction) => runSubcommand(interaction, SUBCOMMANDS);

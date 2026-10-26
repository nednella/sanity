import type { ChatInputCommandInteraction } from "discord.js";

import { api } from "@/lib/api";
import { runSubcommand } from "@/utils/commands";
import { reply, replyError } from "@/utils/replies";

import { NO_MEMBERS_TAGGED, outcomesEmbed, readTaggedMembers } from "../member/utils";

async function changeAccess(interaction: ChatInputCommandInteraction, isRevoked: boolean, title: string) {
  const body = readTaggedMembers(interaction);
  if (body.taggedDiscordIds.length === 0) return replyError(interaction, NO_MEMBERS_TAGGED);

  const { results } = await api.post("/v1/members/plugin-access", { body: { ...body, revoked: isRevoked } });
  return reply(interaction, outcomesEmbed(title, results));
}

const SUBCOMMANDS = {
  revoke: (interaction: ChatInputCommandInteraction) =>
    changeAccess(interaction, true, "Revoke access from the plugin"),
  reinstate: (interaction: ChatInputCommandInteraction) =>
    changeAccess(interaction, false, "Reinstate access to the plugin")
};

export function handlePlugin(interaction: ChatInputCommandInteraction) {
  return runSubcommand(interaction, SUBCOMMANDS);
}

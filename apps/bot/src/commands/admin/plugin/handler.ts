import type { ChatInputCommandInteraction } from "discord.js";

import { NO_MEMBERS_TAGGED, changesEmbed, readTaggedMembers } from "@/commands/admin/member/utils";
import { api } from "@/lib/api";
import { runSubcommand } from "@/utils/commands";
import { reply, replyError } from "@/utils/replies";

const SUBCOMMANDS = {
  revoke: (interaction: ChatInputCommandInteraction) =>
    changeAccess(interaction, true, "Revoke access from the plugin"),
  reinstate: (interaction: ChatInputCommandInteraction) =>
    changeAccess(interaction, false, "Reinstate access to the plugin")
};

export function handlePlugin(interaction: ChatInputCommandInteraction) {
  return runSubcommand(interaction, SUBCOMMANDS);
}

async function changeAccess(interaction: ChatInputCommandInteraction, isRevoked: boolean, title: string) {
  const { taggedDiscordIds, ...body } = readTaggedMembers(interaction);
  if (taggedDiscordIds.length === 0) return replyError(interaction, NO_MEMBERS_TAGGED);

  const changes = await api.post("/v1/members/plugin-access", { body: { ...body, revoked: isRevoked } });
  function describe() {
    return isRevoked
      ? "has lost plugin access, and their key is revoked"
      : "has plugin access again, with a new key from /plugin-key";
  }
  return reply(interaction, changesEmbed(title, describe, changes, taggedDiscordIds));
}

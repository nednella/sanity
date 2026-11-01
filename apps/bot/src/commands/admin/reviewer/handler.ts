import type { ChatInputCommandInteraction } from "discord.js";

import { api } from "@/lib/api";
import { runSubcommand } from "@/utils/commands";
import { reply, replyError } from "@/utils/replies";

import { NO_MEMBERS_TAGGED, changesEmbed, readTaggedMembers } from "../member/utils";

async function addReviewer(interaction: ChatInputCommandInteraction) {
  const { taggedDiscordIds, ...body } = readTaggedMembers(interaction);
  if (taggedDiscordIds.length === 0) return replyError(interaction, NO_MEMBERS_TAGGED);

  const changes = await api.post("/v1/members/role", { body: { ...body, role: "reviewer" } });
  return reply(
    interaction,
    changesEmbed("Add reviewer", () => "is now a reviewer", changes, taggedDiscordIds)
  );
}

async function removeReviewer(interaction: ChatInputCommandInteraction) {
  const { taggedDiscordIds, ...body } = readTaggedMembers(interaction);
  if (taggedDiscordIds.length === 0) return replyError(interaction, NO_MEMBERS_TAGGED);

  const changes = await api.delete("/v1/members/role", { body });
  return reply(
    interaction,
    changesEmbed("Remove reviewer", () => "no longer has a role", changes, taggedDiscordIds)
  );
}

const SUBCOMMANDS = {
  add: addReviewer,
  remove: removeReviewer
};

export function handleReviewer(interaction: ChatInputCommandInteraction) {
  return runSubcommand(interaction, SUBCOMMANDS);
}

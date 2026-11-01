import type { ChatInputCommandInteraction } from "discord.js";

import { api } from "@/lib/api";
import { runSubcommand } from "@/utils/commands";
import { reply, replyError } from "@/utils/replies";

import { NO_MEMBERS_TAGGED, changesEmbed, readTaggedMembers } from "../member/utils";

async function addAdmin(interaction: ChatInputCommandInteraction) {
  const { taggedDiscordIds, ...body } = readTaggedMembers(interaction);
  if (taggedDiscordIds.length === 0) return replyError(interaction, NO_MEMBERS_TAGGED);

  const changes = await api.post("/v1/members/admin", { body: { ...body, role: "admin" } });
  return reply(
    interaction,
    changesEmbed("Add admin", () => "is now an admin", changes, taggedDiscordIds)
  );
}

async function removeAdmin(interaction: ChatInputCommandInteraction) {
  const { taggedDiscordIds, ...body } = readTaggedMembers(interaction);
  if (taggedDiscordIds.length === 0) return replyError(interaction, NO_MEMBERS_TAGGED);

  const changes = await api.delete("/v1/members/admin", { body });
  return reply(
    interaction,
    changesEmbed("Remove admin", () => "no longer has a role", changes, taggedDiscordIds)
  );
}

const SUBCOMMANDS = {
  add: addAdmin,
  remove: removeAdmin
};

export function handleAdmin(interaction: ChatInputCommandInteraction) {
  return runSubcommand(interaction, SUBCOMMANDS);
}

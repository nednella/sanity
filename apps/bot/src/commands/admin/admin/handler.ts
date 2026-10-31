import type { ChatInputCommandInteraction } from "discord.js";

import { api } from "@/lib/api";
import { runSubcommand } from "@/utils/commands";
import { reply, replyError } from "@/utils/replies";

import { NO_MEMBERS_TAGGED, changesEmbed, readTaggedMembers } from "../member/utils";

async function changeRole(interaction: ChatInputCommandInteraction, role: "admin" | null, title: string) {
  const { taggedDiscordIds, ...body } = readTaggedMembers(interaction);
  if (taggedDiscordIds.length === 0) return replyError(interaction, NO_MEMBERS_TAGGED);

  const changes = await api.post("/v1/members/role", { body: { ...body, role } });
  const describe = () => (role === null ? "is no longer an admin" : "is now an admin");
  return reply(interaction, changesEmbed(title, describe, changes, taggedDiscordIds));
}

const SUBCOMMANDS = {
  add: (interaction: ChatInputCommandInteraction) => changeRole(interaction, "admin", "Add admin"),
  remove: (interaction: ChatInputCommandInteraction) => changeRole(interaction, null, "Remove admin")
};

export function handleAdmin(interaction: ChatInputCommandInteraction) {
  return runSubcommand(interaction, SUBCOMMANDS);
}

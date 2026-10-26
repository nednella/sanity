import type { ChatInputCommandInteraction } from "discord.js";

import { api } from "@/lib/api";
import { runSubcommand } from "@/utils/commands";
import { reply, replyError } from "@/utils/replies";

import { NO_MEMBERS_TAGGED, outcomesEmbed, readTaggedMembers } from "../member/utils";

async function changeRole(interaction: ChatInputCommandInteraction, role: "admin" | null, title: string) {
  const body = readTaggedMembers(interaction);
  if (body.taggedDiscordIds.length === 0) return replyError(interaction, NO_MEMBERS_TAGGED);

  const { results } = await api.post("/v1/members/role", { body: { ...body, role } });
  return reply(interaction, outcomesEmbed(title, results));
}

const SUBCOMMANDS = {
  add: (interaction: ChatInputCommandInteraction) => changeRole(interaction, "admin", "Add admin"),
  remove: (interaction: ChatInputCommandInteraction) => changeRole(interaction, null, "Remove admin")
};

export function handleAdmin(interaction: ChatInputCommandInteraction) {
  return runSubcommand(interaction, SUBCOMMANDS);
}

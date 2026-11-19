import { type ChatInputCommandInteraction, type SlashCommandUserOption, userMention } from "discord.js";

import { isApiError } from "@sanity/api";

import { api } from "@/lib/api";

import { replyError } from "./replies";

export function taggedUser(interaction: ChatInputCommandInteraction) {
  return interaction.options.getUser("member") ?? interaction.user;
}

export function oneMemberOption(option: SlashCommandUserOption) {
  return option.setName("member").setDescription("Tag a member, or leave it empty for yourself");
}

// Replies for the caller when the tagged user has no member, so a handler only
// has to stop.
export async function findMember(interaction: ChatInputCommandInteraction) {
  const user = taggedUser(interaction);

  try {
    return await api.get("/v1/members/discord/{discordId}", { params: { path: { discordId: user.id } } });
  } catch (error) {
    if (!isApiError(error, 404)) throw error;

    await replyError(interaction, {
      title: "Not a member",
      description: `${userMention(user.id)} is not a member of this clan.`
    });
    return null;
  }
}

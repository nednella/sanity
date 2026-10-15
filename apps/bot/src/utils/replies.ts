import {
  type ActionRowBuilder,
  type ChatInputCommandInteraction,
  type EmbedBuilder,
  type MessageActionRowComponentBuilder,
  type User,
  userMention
} from "discord.js";

import { errorEmbed, warningEmbed } from "./embeds";

type ReplyOptions = { components?: ActionRowBuilder<MessageActionRowComponentBuilder>[] };

// Every command is deferred before it runs, so a reply is always an edit of that deferral.
export const reply = (
  interaction: ChatInputCommandInteraction,
  embed: EmbedBuilder,
  { components }: ReplyOptions = {}
) => interaction.editReply({ embeds: [embed], components });

export const replyError = (interaction: ChatInputCommandInteraction, description: string) =>
  reply(interaction, errorEmbed({ description }));

export const replyNotAMember = (interaction: ChatInputCommandInteraction, user: User) =>
  replyError(
    interaction,
    user.id === interaction.user.id ? "You are not a clan member." : `${userMention(user.id)} is not a clan member.`
  );

export const replyNotImplemented = (interaction: ChatInputCommandInteraction) =>
  reply(interaction, warningEmbed({ description: `\`/${interaction.commandName}\` is not implemented yet.` }));

import {
  ActionRowBuilder,
  AttachmentBuilder,
  ButtonBuilder,
  ButtonStyle,
  type ChatInputCommandInteraction
} from "discord.js";

import type { MemberProfile } from "@sanity/api";
import { WOM_PLAYERS_URL } from "@sanity/urls";

import { config } from "@config";

import { findMember, taggedUser } from "@/utils/members";

import { renderProfileCard } from "./card";

const linkButton = (label: string, url: string) =>
  new ButtonBuilder().setLabel(label).setStyle(ButtonStyle.Link).setURL(url);

const links = ({ id, wom }: MemberProfile) =>
  new ActionRowBuilder<ButtonBuilder>().addComponents(
    linkButton("Website", `${config.webUrl}/members/${id}`),
    ...(wom ? [linkButton("Wise Old Man", `${WOM_PLAYERS_URL}/${encodeURIComponent(wom.username)}`)] : [])
  );

export const handleProfile = async (interaction: ChatInputCommandInteraction) => {
  const profile = await findMember(interaction);
  if (!profile) return;

  const avatarUrl = taggedUser(interaction).displayAvatarURL({ extension: "png", size: 256 });
  const card = new AttachmentBuilder(Buffer.from(await renderProfileCard(profile, avatarUrl)), {
    name: `${profile.displayName}_profile.png`
  });
  await interaction.editReply({ files: [card], components: [links(profile)] });
};

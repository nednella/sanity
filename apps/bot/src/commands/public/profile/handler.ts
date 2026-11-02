import { AttachmentBuilder, type ChatInputCommandInteraction, hyperlink, inlineCode } from "discord.js";

import { config } from "@config";

import { api } from "@/lib/api";
import { runSubcommand } from "@/utils/commands";
import { buildEmbed } from "@/utils/embeds";
import { formatNumber } from "@/utils/format";
import { findMember, taggedUser } from "@/utils/members";
import { reply } from "@/utils/replies";

import { renderDiaryCard, renderProfileCard } from "./card";
import { describeClanAge, describeEarlierDrops, describeLatestDrop, diaryLinks, profileLinks } from "./utils";

const DROPS_SHOWN = 16;

const replyChanged = (interaction: ChatInputCommandInteraction, title: string, description: string) =>
  reply(interaction, buildEmbed({ style: "success", title, description }));

const showProfile = async (interaction: ChatInputCommandInteraction) => {
  const profile = await findMember(interaction);
  if (!profile) return;

  const avatarUrl = taggedUser(interaction).displayAvatarURL({ extension: "png", size: 256 });
  const card = new AttachmentBuilder(Buffer.from(await renderProfileCard(profile, avatarUrl)), {
    name: `${profile.displayName}_profile.png`
  });
  await interaction.editReply({ files: [card], components: [profileLinks(profile)] });
};

const showDrops = async (interaction: ChatInputCommandInteraction) => {
  const member = await findMember(interaction);
  if (!member) return;

  const { items, page } = await api.get("/v1/members/{id}/submissions", {
    params: {
      path: { id: member.id },
      query: {
        limit: DROPS_SHOWN,
        status: "approved"
      }
    }
  });

  const title = `${member.displayName}'s recent drops`;
  const allDrops = hyperlink("See all drops on the website", `${config.webUrl}/members/${member.id}/submissions`);

  const [latest, ...earlier] = items;
  if (!latest) return reply(interaction, buildEmbed({ title, description: `No approved drops yet.\n\n${allDrops}` }));

  const description = [
    `-# ${formatNumber(page.total)} approved drops in total\n${describeLatestDrop(member.id, latest)}`,
    describeEarlierDrops(member.id, earlier),
    allDrops
  ]
    .filter(Boolean)
    .join("\n\n");

  await reply(
    interaction,
    buildEmbed({
      title,
      description,
      image: latest.imageUrl ?? undefined,
      thumbnail: taggedUser(interaction).displayAvatarURL()
    })
  );
};

const showDiary = async (interaction: ChatInputCommandInteraction) => {
  const member = await findMember(interaction);
  if (!member) return;

  const entries = await api.get("/v1/members/{id}/diary", { params: { path: { id: member.id } } });

  const avatarUrl = taggedUser(interaction).displayAvatarURL({ extension: "png", size: 256 });
  const card = new AttachmentBuilder(Buffer.from(await renderDiaryCard(member, entries, avatarUrl)), {
    name: `${member.displayName}_diary.png`
  });
  await interaction.editReply({ files: [card], components: [diaryLinks()] });
};

const showAge = async (interaction: ChatInputCommandInteraction) => {
  const member = await findMember(interaction);
  if (!member) return;

  await reply(
    interaction,
    buildEmbed({
      title: `${member.displayName}'s clan age`,
      description: describeClanAge(member),
      thumbnail: taggedUser(interaction).displayAvatarURL()
    })
  );
};

const updateNationality = async (interaction: ChatInputCommandInteraction) => {
  const nationality = interaction.options.getString("country", true).toUpperCase();
  await api.patch("/v1/members/me", { body: { nationality } });
  return replyChanged(interaction, "Nationality changed", `Your flag is now :flag_${nationality.toLowerCase()}:.`);
};

const removeNationality = async (interaction: ChatInputCommandInteraction) => {
  await api.patch("/v1/members/me", { body: { nationality: null } });
  return replyChanged(interaction, "Nationality removed", "You no longer have a flag on your profile.");
};

const updateRsn = async (interaction: ChatInputCommandInteraction) => {
  const account = interaction.options.getString("account", true);
  const name = interaction.options.getString("name", true);
  const body = account === "main" ? { mainRsn: name } : { altRsn: name };

  await api.patch("/v1/members/me", { body });
  return replyChanged(interaction, "RSN changed", `Your ${account} RSN is now ${inlineCode(name)}.`);
};

const removeRsn = async (interaction: ChatInputCommandInteraction) => {
  await api.patch("/v1/members/me", { body: { altRsn: null } });
  return replyChanged(interaction, "RSN removed", "You no longer have an alt RSN.");
};

const SUBCOMMANDS = {
  age: showAge,
  diary: showDiary,
  drops: showDrops,
  "nationality remove": removeNationality,
  "nationality update": updateNationality,
  "rsn remove": removeRsn,
  "rsn update": updateRsn,
  view: showProfile
};

export const handleProfile = (interaction: ChatInputCommandInteraction) => runSubcommand(interaction, SUBCOMMANDS);

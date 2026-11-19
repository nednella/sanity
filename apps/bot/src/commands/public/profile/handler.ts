import { AttachmentBuilder, type ChatInputCommandInteraction, hyperlink, inlineCode } from "discord.js";

import { isApiError } from "@sanity/api";
import { NO_BIRTH_YEAR, formatNumber, pad } from "@sanity/utils";

import { config } from "@config";

import { api } from "@/lib/api";
import { formatBirthday } from "@/utils/birthdays";
import { runSubcommand } from "@/utils/commands";
import { buildEmbed } from "@/utils/embeds";
import { findMember, taggedUser } from "@/utils/members";
import { reply, replyError } from "@/utils/replies";

import { renderDiaryCard, renderProfileCard } from "./card";
import { describeClanAge, describeEarlierDrops, describeLatestDrop, diaryLinks, profileLinks } from "./utils";

const SUBCOMMANDS = {
  age: showAge,
  "birthday remove": removeBirthday,
  "birthday update": updateBirthday,
  diary: showDiary,
  drops: showDrops,
  "nationality remove": removeNationality,
  "nationality update": updateNationality,
  "rsn remove": removeRsn,
  "rsn update": updateRsn,
  view: showProfile
};

const DROPS_SHOWN = 16;

export function handleProfile(interaction: ChatInputCommandInteraction) {
  return runSubcommand(interaction, SUBCOMMANDS);
}

function replyChanged(interaction: ChatInputCommandInteraction, title: string, description: string) {
  return reply(interaction, buildEmbed({ style: "success", title, description }));
}

async function showProfile(interaction: ChatInputCommandInteraction) {
  const profile = await findMember(interaction);
  if (!profile) return;

  const avatarUrl = taggedUser(interaction).displayAvatarURL({ extension: "png", size: 256 });
  const card = new AttachmentBuilder(Buffer.from(await renderProfileCard(profile, avatarUrl)), {
    name: `${profile.displayName}_profile.png`
  });
  await interaction.editReply({ files: [card], components: [profileLinks(profile)] });
}

async function showDrops(interaction: ChatInputCommandInteraction) {
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
}

async function showDiary(interaction: ChatInputCommandInteraction) {
  const member = await findMember(interaction);
  if (!member) return;

  const entries = await api.get("/v1/members/{id}/diary", { params: { path: { id: member.id } } });

  const avatarUrl = taggedUser(interaction).displayAvatarURL({ extension: "png", size: 256 });
  const card = new AttachmentBuilder(Buffer.from(await renderDiaryCard(member, entries, avatarUrl)), {
    name: `${member.displayName}_diary.png`
  });
  await interaction.editReply({ files: [card], components: [diaryLinks()] });
}

async function showAge(interaction: ChatInputCommandInteraction) {
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
}

async function updateBirthday(interaction: ChatInputCommandInteraction) {
  const day = interaction.options.getInteger("day", true);
  const month = interaction.options.getInteger("month", true);
  const year = interaction.options.getInteger("year") ?? NO_BIRTH_YEAR;
  const birthday = `${year}-${pad(month)}-${pad(day)}`;

  try {
    await api.patch("/v1/members/me", { body: { birthday } });
  } catch (error) {
    if (!isApiError(error, 400)) throw error;
    return replyError(interaction, { title: "Invalid date", description: "That date does not exist." });
  }

  return replyChanged(interaction, "Birthday changed", `Your birthday is now ${formatBirthday(birthday)}.`);
}

async function removeBirthday(interaction: ChatInputCommandInteraction) {
  await api.patch("/v1/members/me", { body: { birthday: null } });
  return replyChanged(interaction, "Birthday removed", "You no longer have a birthday set.");
}

async function updateNationality(interaction: ChatInputCommandInteraction) {
  const nationality = interaction.options.getString("country", true).toUpperCase();
  await api.patch("/v1/members/me", { body: { nationality } });
  return replyChanged(interaction, "Nationality changed", `Your flag is now :flag_${nationality.toLowerCase()}:.`);
}

async function removeNationality(interaction: ChatInputCommandInteraction) {
  await api.patch("/v1/members/me", { body: { nationality: null } });
  return replyChanged(interaction, "Nationality removed", "You no longer have a flag on your profile.");
}

async function updateRsn(interaction: ChatInputCommandInteraction) {
  const account = interaction.options.getString("account", true);
  const name = interaction.options.getString("name", true);
  const body = account === "main" ? { mainRsn: name } : { altRsn: name };

  await api.patch("/v1/members/me", { body });
  return replyChanged(interaction, "RSN changed", `Your ${account} RSN is now ${inlineCode(name)}.`);
}

async function removeRsn(interaction: ChatInputCommandInteraction) {
  await api.patch("/v1/members/me", { body: { altRsn: null } });
  return replyChanged(interaction, "RSN removed", "You no longer have an alt RSN.");
}

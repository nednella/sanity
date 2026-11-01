import { AttachmentBuilder, type ChatInputCommandInteraction, hyperlink } from "discord.js";

import { config } from "@config";

import { api } from "@/lib/api";
import { runSubcommand } from "@/utils/commands";
import { buildEmbed } from "@/utils/embeds";
import { formatNumber } from "@/utils/format";
import { findMember, taggedUser } from "@/utils/members";
import { reply } from "@/utils/replies";

import { renderProfileCard } from "./card";
import { describeClanAge, describeEarlierDrops, describeLatestDrop, profileLinks } from "./utils";

const DROPS_SHOWN = 16;

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

const SUBCOMMANDS = {
  age: showAge,
  drops: showDrops,
  view: showProfile
};

export const handleProfile = (interaction: ChatInputCommandInteraction) => runSubcommand(interaction, SUBCOMMANDS);

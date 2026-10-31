import {
  type CategoryChannel,
  type ChatInputCommandInteraction,
  GuildMember,
  channelMention,
  userMention
} from "discord.js";

import { api } from "@/lib/api";
import { resolveCategory } from "@/lib/channels";
import { logger } from "@/lib/logger";
import { runSubcommand } from "@/utils/commands";
import { buildEmbed } from "@/utils/embeds";
import { reply, replyError } from "@/utils/replies";

import { NO_MEMBERS_TAGGED, changesEmbed, readTaggedMembers } from "./utils";

type AccountUpdate = (name: string, account: string) => { style: "error" | "success" | "warning"; description: string };

const ACCOUNT_UPDATES = {
  "discord-account-changed": (name, account) => ({ style: "success", description: `${name} now uses ${account}.` }),
  "discord-id-taken": (_, account) => ({ style: "error", description: `${account} belongs to another member.` }),
  "non-unique-display-name": (name) => ({ style: "error", description: `More than one member is named ${name}.` }),
  "not-a-member": (name) => ({ style: "error", description: `No member is named ${name}.` }),
  unchanged: (name, account) => ({ style: "warning", description: `${name} already uses ${account}.` })
} satisfies Record<string, AccountUpdate>;

const discordId = async (interaction: ChatInputCommandInteraction) => {
  const name = interaction.options.getString("name", true);
  const account = interaction.options.getUser("account", true);

  const { member, outcome } = await api.post("/v1/discord/update-account", {
    body: {
      account: {
        avatarHash: account.avatar,
        discordId: account.id
      },
      displayName: name
    }
  });

  const update = ACCOUNT_UPDATES[outcome](member?.displayName ?? name, userMention(account.id));
  await reply(interaction, buildEmbed({ title: "Discord account", ...update }));
};

const pass = async (interaction: ChatInputCommandInteraction) => {
  const { taggedDiscordIds, ...body } = readTaggedMembers(interaction);
  if (taggedDiscordIds.length === 0) return replyError(interaction, NO_MEMBERS_TAGGED);

  const changes = await api.post("/v1/members/pass-trial", { body });
  return reply(
    interaction,
    changesEmbed("Pass trial", ({ rank }) => `has passed their trial! Rank: ${rank!.name}`, changes, taggedDiscordIds)
  );
};

const quit = async (interaction: ChatInputCommandInteraction) => {
  const { taggedDiscordIds, ...body } = readTaggedMembers(interaction);
  if (taggedDiscordIds.length === 0) return replyError(interaction, NO_MEMBERS_TAGGED);

  const changes = await api.post("/v1/members/quit", { body });
  return reply(
    interaction,
    changesEmbed("Quit", () => "has now quit the clan", changes, taggedDiscordIds)
  );
};

const retire = async (interaction: ChatInputCommandInteraction) => {
  const { taggedDiscordIds, ...body } = readTaggedMembers(interaction);
  if (taggedDiscordIds.length === 0) return replyError(interaction, NO_MEMBERS_TAGGED);

  const changes = await api.post("/v1/members/retire", { body });
  return reply(
    interaction,
    changesEmbed("Retire", () => "has now been retired", changes, taggedDiscordIds)
  );
};

const openTrialChannels = async (
  applicationCategory: CategoryChannel,
  feedbackCategory: CategoryChannel,
  displayName: string,
  application: string
) => {
  const applicationChannel = await applicationCategory.children.create({ name: displayName });
  await applicationChannel.send({
    embeds: [buildEmbed({ title: `${displayName}'s application`, description: application })]
  });
  const feedbackChannel = await feedbackCategory.children.create({ name: `${displayName}-feedback` });
  return { applicationChannel, feedbackChannel };
};

const trial = async (interaction: ChatInputCommandInteraction) => {
  const user = interaction.options.getUser("member", true);
  const member = interaction.options.getMember("member");
  const displayName = member instanceof GuildMember ? member.displayName : user.displayName;

  const [applicationCategory, feedbackCategory] = await Promise.all([
    resolveCategory(interaction.client, "trial_applications"),
    resolveCategory(interaction.client, "trial_feedback")
  ]);

  const { results } = await api.post("/v1/members/trial", {
    body: {
      trialists: [
        {
          altRsn: interaction.options.getString("alt_rsn"),
          discordId: user.id,
          displayName,
          mainRsn: interaction.options.getString("main_rsn", true)
        }
      ]
    }
  });
  const [result] = results;
  const started =
    result?.outcome === "retrialling"
      ? `${userMention(user.id)} is trialling again, with ${result.pointsCleared} points cleared.`
      : `${userMention(user.id)} is now trialling.`;

  // The trial is saved by now, so a failure in Discord is reported, not undone.
  try {
    const { applicationChannel, feedbackChannel } = await openTrialChannels(
      applicationCategory,
      feedbackCategory,
      displayName,
      interaction.options.getString("application", true)
    );
    await reply(
      interaction,
      buildEmbed({
        style: "success",
        title: "Trial started",
        description: started,
        fields: [
          { name: "Application", value: channelMention(applicationChannel.id), inline: true },
          { name: "Feedback", value: channelMention(feedbackChannel.id), inline: true }
        ]
      })
    );
  } catch (error) {
    logger.error(error, "could not open the trial channels");
    await reply(
      interaction,
      buildEmbed({
        style: "warning",
        title: "Trial started without channels",
        description: `${started} I could not make the trial channels, so make them by hand.`
      })
    );
  }
};

const unretire = async (interaction: ChatInputCommandInteraction) => {
  const { taggedDiscordIds, ...body } = readTaggedMembers(interaction);
  if (taggedDiscordIds.length === 0) return replyError(interaction, NO_MEMBERS_TAGGED);

  const changes = await api.post("/v1/members/unretire", { body });
  return reply(
    interaction,
    changesEmbed("Unretire", ({ rank }) => `has been unretired! Rank: ${rank!.name}`, changes, taggedDiscordIds)
  );
};

const SUBCOMMANDS = {
  discord_id: discordId,
  pass,
  quit,
  retire,
  trial,
  unretire
};

export const handleMember = (interaction: ChatInputCommandInteraction) => runSubcommand(interaction, SUBCOMMANDS);

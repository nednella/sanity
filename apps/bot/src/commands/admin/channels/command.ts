import { ChannelType, SlashCommandBuilder } from "discord.js";

import { purposeChoices } from "@/lib/channels";
import { defineCommand } from "@/utils/commands";

import { handleChannels } from "./handler";

export const channels = defineCommand({
  data: new SlashCommandBuilder()
    .setName("channels")
    .setDescription("Manage the channels and categories the bot uses")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("clear")
        .setDescription("Unset one of the bot's channels")
        .addStringOption((option) =>
          option
            .setName("purpose")
            .setDescription("What the channel was used for")
            .setRequired(true)
            .addChoices(...purposeChoices())
        )
    )
    .addSubcommand((subcommand) =>
      subcommand.setName("list").setDescription("Show the channels and categories the bot uses")
    )
    .addSubcommandGroup((group) =>
      group
        .setName("set")
        .setDescription("Point one of the bot's channels at a channel or category")
        .addSubcommand((subcommand) =>
          subcommand
            .setName("category")
            .setDescription("Set a category the bot creates channels in")
            .addStringOption((option) =>
              option
                .setName("purpose")
                .setDescription("What the category is used for")
                .setRequired(true)
                .addChoices(...purposeChoices("category"))
            )
            .addChannelOption((option) =>
              option
                .setName("category")
                .setDescription("The category to use")
                .setRequired(true)
                .addChannelTypes(ChannelType.GuildCategory)
            )
        )
        .addSubcommand((subcommand) =>
          subcommand
            .setName("text")
            .setDescription("Set a text channel the bot posts messages in")
            .addStringOption((option) =>
              option
                .setName("purpose")
                .setDescription("What the channel is used for")
                .setRequired(true)
                .addChoices(...purposeChoices("text"))
            )
            .addChannelOption((option) =>
              option
                .setName("channel")
                .setDescription("The channel to use")
                .setRequired(true)
                .addChannelTypes(ChannelType.GuildText)
            )
        )
    )
    .addSubcommandGroup((group) =>
      group
        .setName("test")
        .setDescription("Post a test message in one of the bot's channels or categories")
        .addSubcommand((subcommand) =>
          subcommand
            .setName("category")
            .setDescription("Create a channel in a category and post a test message in it")
            .addStringOption((option) =>
              option
                .setName("purpose")
                .setDescription("The category to create the channel in")
                .setRequired(true)
                .addChoices(...purposeChoices("category"))
            )
            .addStringOption((option) =>
              option.setName("name").setDescription("The name of the channel to create").setRequired(true)
            )
        )
        .addSubcommand((subcommand) =>
          subcommand
            .setName("text")
            .setDescription("Post a test message in one of the bot's channels")
            .addStringOption((option) =>
              option
                .setName("purpose")
                .setDescription("The channel to post in")
                .setRequired(true)
                .addChoices(...purposeChoices("text"))
            )
        )
    ),
  category: "Setup",
  admin: true,
  execute: handleChannels
});

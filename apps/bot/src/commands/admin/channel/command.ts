import { ChannelType, SlashCommandBuilder } from "discord.js";

import { purposeChoices } from "@/lib/channels";
import { defineCommand } from "@/utils/commands";

import { handleChannel } from "./handler";

export const channel = defineCommand({
  data: new SlashCommandBuilder()
    .setName("channel")
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
    ),
  category: "Setup",
  admin: true,
  execute: handleChannel
});

import { SlashCommandBuilder, type SlashCommandStringOption } from "discord.js";

import { defineCommand } from "@/utils/commands";

import { handleRsn } from "./handler";

const nameOption = (option: SlashCommandStringOption) =>
  option.setName("name").setDescription("Your RSN").setRequired(true).setMaxLength(12);

export const rsn = defineCommand({
  data: new SlashCommandBuilder()
    .setName("rsn")
    .setDescription("Change your main or alt RSN")
    .addSubcommandGroup((group) =>
      group
        .setName("set")
        .setDescription("Set your main or alt RSN")
        .addSubcommand((subcommand) =>
          subcommand.setName("alt").setDescription("Set your alt RSN").addStringOption(nameOption)
        )
        .addSubcommand((subcommand) =>
          subcommand.setName("main").setDescription("Set your main RSN").addStringOption(nameOption)
        )
    )
    .addSubcommandGroup((group) =>
      group
        .setName("unset")
        .setDescription("Remove your alt RSN")
        .addSubcommand((subcommand) => subcommand.setName("alt").setDescription("Remove your alt RSN"))
    ),
  category: "Profile",
  selfOnly: true,
  execute: handleRsn
});

import { SlashCommandBuilder } from "discord.js";

import { defineCommand } from "@/utils/commands";

import { handleMember } from "./handler";
import { membersOption, noteOption } from "./utils";

export const member = defineCommand({
  data: new SlashCommandBuilder()
    .setName("member")
    .setDescription("Manage the clan's members")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("discord_id")
        .setDescription("Move a member to a new Discord account")
        .addStringOption((option) =>
          option.setName("name").setDescription("The member's name in the clan").setRequired(true).setMaxLength(32)
        )
        .addUserOption((option) => option.setName("account").setDescription("Tag the new account").setRequired(true))
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("pass")
        .setDescription("Pass trialists")
        .addStringOption(membersOption)
        .addStringOption(noteOption)
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("quit")
        .setDescription("Remove members from the clan")
        .addStringOption(membersOption)
        .addStringOption(noteOption)
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("retire")
        .setDescription("Retire members")
        .addStringOption(membersOption)
        .addStringOption(noteOption)
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("trial")
        .setDescription("Start a trial and make its application and feedback channels")
        .addUserOption((option) => option.setName("member").setDescription("Tag the trialist").setRequired(true))
        .addStringOption((option) =>
          option.setName("main_rsn").setDescription("Their main RSN").setRequired(true).setMaxLength(12)
        )
        .addStringOption((option) =>
          option.setName("application").setDescription("Their application").setRequired(true).setMaxLength(4096)
        )
        .addStringOption((option) => option.setName("alt_rsn").setDescription("Their alt RSN").setMaxLength(12))
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("unretire")
        .setDescription("Bring retired members back")
        .addStringOption(membersOption)
        .addStringOption(noteOption)
    ),
  category: "Membership",
  admin: true,
  execute: handleMember
});

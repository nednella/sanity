import { SlashCommandBuilder } from "discord.js";

import { defineCommand } from "@/utils/commands";
import { oneMemberOption } from "@/utils/members";

import { handleProfile } from "./handler";

export const profile = defineCommand({
  data: new SlashCommandBuilder()
    .setName("profile")
    .setDescription("See a member's profile")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("age")
        .setDescription("Show how long a member has been in the clan")
        .addUserOption(oneMemberOption)
    )
    .addSubcommand((subcommand) =>
      subcommand.setName("drops").setDescription("Show a member's latest approved drops").addUserOption(oneMemberOption)
    )
    .addSubcommand((subcommand) =>
      subcommand.setName("view").setDescription("Show a member's profile").addUserOption(oneMemberOption)
    ),
  category: "Profile",
  execute: handleProfile
});

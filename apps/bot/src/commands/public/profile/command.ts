import { SlashCommandBuilder } from "discord.js";

import { defineCommand } from "@/utils/commands";
import { oneMemberOption } from "@/utils/members";

import { handleProfile } from "./handler";

export const profile = defineCommand({
  data: new SlashCommandBuilder()
    .setName("profile")
    .setDescription("See or change a member's profile")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("age")
        .setDescription("Show how long a member has been in the clan")
        .addUserOption(oneMemberOption)
    )
    .addSubcommand((subcommand) =>
      subcommand.setName("diary").setDescription("Show a member's speedrun diary").addUserOption(oneMemberOption)
    )
    .addSubcommand((subcommand) =>
      subcommand.setName("drops").setDescription("Show a member's latest approved drops").addUserOption(oneMemberOption)
    )
    .addSubcommand((subcommand) =>
      subcommand.setName("view").setDescription("Show a member's profile").addUserOption(oneMemberOption)
    )
    .addSubcommandGroup((group) =>
      group
        .setName("nationality")
        .setDescription("Change the flag on your profile")
        .addSubcommand((subcommand) =>
          subcommand
            .setName("update")
            .setDescription("Update the flag on your profile")
            .addStringOption((option) =>
              option
                .setName("country")
                .setDescription("Two-letter country code, such as GB")
                .setMinLength(2)
                .setMaxLength(2)
                .setRequired(true)
            )
        )
        .addSubcommand((subcommand) => subcommand.setName("remove").setDescription("Remove the flag from your profile"))
    ),
  category: "Profile",
  execute: handleProfile
});

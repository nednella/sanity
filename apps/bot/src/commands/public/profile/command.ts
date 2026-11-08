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
        .setName("birthday")
        .setDescription("Change your birthday")
        .addSubcommand((subcommand) =>
          subcommand
            .setName("update")
            .setDescription("Update your birthday")
            .addIntegerOption((option) =>
              option.setName("day").setDescription("Which day").setMinValue(1).setMaxValue(31).setRequired(true)
            )
            .addIntegerOption((option) =>
              option.setName("month").setDescription("Which month").setMinValue(1).setMaxValue(12).setRequired(true)
            )
            .addIntegerOption((option) =>
              option.setName("year").setDescription("Which year").setMinValue(1900).setMaxValue(9999).setRequired(true)
            )
        )
        .addSubcommand((subcommand) => subcommand.setName("remove").setDescription("Remove your birthday"))
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
    )
    .addSubcommandGroup((group) =>
      group
        .setName("rsn")
        .setDescription("Change your main or alt RSN")
        .addSubcommand((subcommand) =>
          subcommand
            .setName("update")
            .setDescription("Update your main or alt RSN")
            .addStringOption((option) =>
              option
                .setName("account")
                .setDescription("Which RSN to update")
                .addChoices({ name: "Main", value: "main" }, { name: "Alt", value: "alt" })
                .setRequired(true)
            )
            .addStringOption((option) =>
              option.setName("name").setDescription("Your RSN").setMaxLength(12).setRequired(true)
            )
        )
        .addSubcommand((subcommand) => subcommand.setName("remove").setDescription("Remove your alt RSN"))
    ),
  category: "Profile",
  execute: handleProfile
});

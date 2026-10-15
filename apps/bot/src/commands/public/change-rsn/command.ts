import { SlashCommandBuilder } from "discord.js";

import { defineCommand } from "@/utils/commands";

import { handleChangeRsn } from "./handler";

export const changeRsn = defineCommand({
  data: new SlashCommandBuilder()
    .setName("change_rsn")
    .setDescription("Change your main or alt RSN")
    .addStringOption((option) =>
      option
        .setName("account")
        .setDescription("Which RSN to change")
        .addChoices({ name: "Main", value: "mainRsn" }, { name: "Alt", value: "altRsn" })
        .setRequired(true)
    )
    .addStringOption((option) =>
      option.setName("rsn").setDescription("The new RSN").setMinLength(1).setMaxLength(12).setRequired(true)
    ),
  category: "Profile",
  execute: handleChangeRsn
});

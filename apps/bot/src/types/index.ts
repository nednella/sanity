import type { ChatInputCommandInteraction, SlashCommandOptionsOnlyBuilder } from "discord.js";

export type Category =
  | "Catalogue"
  | "Deaths"
  | "Diary"
  | "Events"
  | "General"
  | "Health"
  | "Membership"
  | "Points"
  | "Profile"
  | "Records"
  | "Roles"
  | "Setup"
  | "Submissions"
  | "Voice";

export type Execute = (interaction: ChatInputCommandInteraction) => Promise<unknown>;

export type Command = SlashCommandOptionsOnlyBuilder & {
  admin: boolean;
  category: Category;
  selfOnly: boolean;
  execute: Execute;
};

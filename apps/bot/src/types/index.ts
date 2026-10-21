import type {
  ChatInputCommandInteraction,
  SlashCommandOptionsOnlyBuilder,
  SlashCommandSubcommandsOnlyBuilder
} from "discord.js";

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

export type CommandData = SlashCommandOptionsOnlyBuilder | SlashCommandSubcommandsOnlyBuilder;

export type Command = CommandData & {
  admin: boolean;
  category: Category;
  selfOnly: boolean;
  execute: Execute;
};

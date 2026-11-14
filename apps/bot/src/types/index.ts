import type {
  AutocompleteInteraction,
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
  | "Mainframe"
  | "Membership"
  | "Misc"
  | "Plugin"
  | "Points"
  | "Profile"
  | "Rank"
  | "Records"
  | "Reviewer"
  | "Roles"
  | "Setup"
  | "Submissions"
  | "Voice";

export type Execute = (interaction: ChatInputCommandInteraction) => Promise<unknown>;

export type Autocomplete = (interaction: AutocompleteInteraction) => Promise<unknown>;

export type CommandData = SlashCommandOptionsOnlyBuilder | SlashCommandSubcommandsOnlyBuilder;

export type Command = CommandData & {
  admin: boolean;
  category: Category;
  selfOnly: boolean;
  execute: Execute;
  autocomplete?: Autocomplete;
};

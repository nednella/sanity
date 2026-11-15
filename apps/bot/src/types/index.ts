import type {
  AutocompleteInteraction,
  ChatInputCommandInteraction,
  SlashCommandOptionsOnlyBuilder,
  SlashCommandSubcommandsOnlyBuilder
} from "discord.js";

export type Category =
  | "Admin"
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
  | "Roles"
  | "Setup"
  | "Submissions"
  | "Voice";

export type Execute = (interaction: ChatInputCommandInteraction) => Promise<unknown>;

export type Autocomplete = (interaction: AutocompleteInteraction) => Promise<unknown>;

export type CommandData = SlashCommandOptionsOnlyBuilder | SlashCommandSubcommandsOnlyBuilder;

export type Command = CommandData & {
  admin: boolean;
  autocomplete?: Autocomplete;
  category: Category;
  execute: Execute;
  selfOnly: boolean;
};

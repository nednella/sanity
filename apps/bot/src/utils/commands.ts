import type { ChatInputCommandInteraction } from "discord.js";

import type { Category, Command, CommandData, Execute } from "@/types";

type Options = {
  admin?: boolean;
  category: Category;
  data: CommandData;
  selfOnly?: boolean;
  execute: Execute;
};

export const defineCommand = ({ admin = false, data, selfOnly = false, ...options }: Options): Command => {
  // Hide admin commands by default - the server decides access using the integration settings
  if (admin) data.setDefaultMemberPermissions(0);
  return Object.assign(data, { admin, selfOnly, ...options });
};

// A subcommand inside a group is keyed by both names, such as "set text".
export const runSubcommand = (interaction: ChatInputCommandInteraction, subcommands: Record<string, Execute>) => {
  const name = [interaction.options.getSubcommandGroup(), interaction.options.getSubcommand(true)]
    .filter(Boolean)
    .join(" ");
  const run = subcommands[name];
  if (!run) throw new Error(`no handler for /${interaction.commandName} ${name}`);
  return run(interaction);
};

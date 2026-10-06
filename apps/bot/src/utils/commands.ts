import type { SlashCommandOptionsOnlyBuilder } from "discord.js";

import type { Category, Command, Execute } from "@/types";

type Options = {
  admin?: boolean;
  category: Category;
  data: SlashCommandOptionsOnlyBuilder;
  selfOnly?: boolean;
  execute: Execute;
};

export const defineCommand = ({ admin = false, data, selfOnly = false, ...options }: Options): Command => {
  // Hide admin commands by default - the server decides access using the integration settings
  if (admin) data.setDefaultMemberPermissions(0);
  return Object.assign(data, { admin, selfOnly, ...options });
};

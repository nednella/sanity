import type { ChatInputCommandInteraction } from "discord.js";

import { api } from "@/lib/api";
import { runMemberCommand } from "@/utils/member-commands";

export const handlePassTrial = (interaction: ChatInputCommandInteraction) =>
  runMemberCommand(interaction, "Pass Trial", (body) => api.post("/v1/admin/members/pass-trial", { body }));

import type { ChatInputCommandInteraction } from "discord.js";

import { api } from "@/lib/api";
import { runMemberCommand } from "@/utils/member-commands";

export const handleRetire = (interaction: ChatInputCommandInteraction) =>
  runMemberCommand(interaction, "Retire", (body) => api.post("/v1/admin/members/retire", { body }));

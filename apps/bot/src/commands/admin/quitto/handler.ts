import type { ChatInputCommandInteraction } from "discord.js";

import { api } from "@/lib/api";
import { runMemberCommand } from "@/utils/member-commands";

export const handleQuitto = (interaction: ChatInputCommandInteraction) =>
  runMemberCommand(interaction, "Quitto", (body) => api.post("/v1/admin/members/quit", { body }));

import type { ChatInputCommandInteraction } from "discord.js";

import { api } from "@/lib/api";
import { runMemberCommand } from "@/utils/member-commands";

export const handleUnretire = (interaction: ChatInputCommandInteraction) =>
  runMemberCommand(interaction, "Unretire", (body) => api.post("/v1/admin/members/unretire", { body }));

import type { ChatInputCommandInteraction } from "discord.js";

import { api } from "@/lib/api";
import { runMemberCommand } from "@/utils/member-commands";

export const handleRanksGracePeriod = (interaction: ChatInputCommandInteraction) =>
  runMemberCommand(interaction, "Ranks Grace Period", (body) => api.post("/v1/admin/members/delay-demotion", { body }));

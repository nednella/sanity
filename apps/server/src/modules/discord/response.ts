import { z } from "zod";

import { bigIntString } from "@/schema/codecs";

export const updatedDiscordAccount = z.object({
  member: z.object({ id: bigIntString, displayName: z.string() }).nullable(),
  outcome: z.enum([
    "discord-account-changed",
    "discord-id-taken",
    "non-unique-display-name",
    "not-a-member",
    "unchanged"
  ])
});

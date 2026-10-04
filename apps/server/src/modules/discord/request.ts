import { z } from "zod";

import { bigIntString } from "@/schema/codecs";

const discordAccount = z.object({
  avatarHash: z.string().trim().min(1).nullable(),
  discordId: bigIntString
});

export const saveAvatarsBody = z.object({ avatars: z.array(discordAccount).min(1).max(1000) });

export const updateDiscordAccountBody = z.object({
  account: discordAccount,
  actingDiscordId: bigIntString.optional(),
  displayName: z.string().trim().min(1).max(32)
});

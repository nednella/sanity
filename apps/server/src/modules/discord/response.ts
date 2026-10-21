import { z } from "zod";

import { bigIntString } from "@/schema/codecs";

const discordChannel = z
  .object({
    purpose: z.string(),
    channelId: bigIntString
  })
  .register(z.globalRegistry, { id: "DiscordChannel" });

export const discordChannels = z.array(discordChannel);

export const savedAvatars = z.object({ saved: z.number() });

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

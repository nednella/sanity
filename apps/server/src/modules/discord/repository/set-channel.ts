import { sql } from "drizzle-orm";

import type { Transaction } from "@db/index";
import { discordChannels } from "@db/schema";

type Purpose = (typeof discordChannels.$inferInsert)["purpose"];

export const setChannel = async (tx: Transaction, purpose: Purpose, channelId: bigint) => {
  await tx
    .insert(discordChannels)
    .values({ channelId, purpose })
    .onConflictDoUpdate({ target: discordChannels.purpose, set: { channelId: sql`excluded.channel_id` } });
};

import { eq } from "drizzle-orm";

import type { Transaction } from "@db/index";
import { discordChannels } from "@db/schema";

type Purpose = (typeof discordChannels.$inferInsert)["purpose"];

export const clearChannel = async (tx: Transaction, purpose: Purpose) => {
  await tx.delete(discordChannels).where(eq(discordChannels.purpose, purpose));
};

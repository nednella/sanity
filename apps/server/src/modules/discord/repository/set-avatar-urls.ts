import { eq } from "drizzle-orm";

import { db } from "@db/index";
import { discordAccounts } from "@db/schema";

// Accounts we don't hold are skipped. Returns how many were updated.
export async function setAvatarUrls(avatars: { avatarUrl: string | null; discordId: bigint }[]) {
  return db.transaction(async (tx) => {
    let saved = 0;
    for (const { avatarUrl, discordId } of avatars) {
      const updated = await tx
        .update(discordAccounts)
        .set({ avatarUrl })
        .where(eq(discordAccounts.discordId, discordId))
        .returning({ memberId: discordAccounts.memberId });
      saved += updated.length;
    }
    return saved;
  });
}

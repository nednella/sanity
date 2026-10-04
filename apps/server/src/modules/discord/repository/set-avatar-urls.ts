import { eq } from "drizzle-orm";

import { db } from "@db/index";
import { membersDiscordAccounts } from "@db/schema";

// Accounts we don't hold are skipped. Returns how many were updated.
export const setAvatarUrls = async (avatars: { avatarUrl: string | null; discordId: bigint }[]) =>
  db.transaction(async (tx) => {
    let saved = 0;
    for (const { avatarUrl, discordId } of avatars) {
      const updated = await tx
        .update(membersDiscordAccounts)
        .set({ avatarUrl })
        .where(eq(membersDiscordAccounts.discordId, discordId))
        .returning({ memberId: membersDiscordAccounts.memberId });
      saved += updated.length;
    }
    return saved;
  });

import type { MemberRole } from "@db/enums";
import { type Transaction, db } from "@db/index";

import { listMembersByDiscordId } from "../../repository/list-members-by-discord-id";

export type TaggedMember = {
  displayName: string;
  id: bigint;
  rankId: number;
  role: MemberRole | null;
};

export const executePerTaggedMember = async <T extends { outcome: string }>(
  { taggedDiscordIds }: { taggedDiscordIds: bigint[] },
  handle: (tx: Transaction, member: TaggedMember) => Promise<T>
) =>
  db.transaction(async (tx) => {
    const discordIds = [...new Set(taggedDiscordIds)];
    const found = await listMembersByDiscordId(tx, discordIds);

    const results = [];
    for (const discordId of discordIds) {
      const member = found.get(discordId);
      if (!member) {
        results.push({ discordId, displayName: null, memberId: null, outcome: "not-a-member" as const });
        continue;
      }

      results.push({
        discordId,
        displayName: member.displayName,
        memberId: member.id,
        ...(await handle(tx, member))
      });
    }

    return results;
  });

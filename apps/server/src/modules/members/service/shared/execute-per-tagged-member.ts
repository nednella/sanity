import { type Transaction, db } from "@db/index";

import { findMemberIdByDiscordId } from "../../repository/find-member-id-by-discord-id";
import { listMembersByDiscordId } from "../../repository/list-members-by-discord-id";

export type TaggedMember = {
  displayName: string;
  id: bigint;
  rankId: number;
};

export type AdminCommand = {
  actingDiscordId?: bigint;
  taggedDiscordIds: bigint[];
  note?: string;
};

export const executePerTaggedMember = async <T extends { outcome: string }>(
  { actingDiscordId, taggedDiscordIds }: { actingDiscordId?: bigint; taggedDiscordIds: bigint[] },
  handle: (tx: Transaction, member: TaggedMember, actingMemberId: bigint | undefined) => Promise<T>
) =>
  db.transaction(async (tx) => {
    const actingMemberId = await findMemberIdByDiscordId(tx, actingDiscordId);
    const discordIds = [...new Set(taggedDiscordIds)];
    const found = await listMembersByDiscordId(tx, discordIds);

    const results = [];
    for (const discordId of discordIds) {
      const member = found.get(discordId);
      if (!member) {
        results.push({ discordId, displayName: null, memberId: null, outcome: "not-a-member" });
        continue;
      }

      results.push({
        discordId,
        displayName: member.displayName,
        memberId: member.id,
        ...(await handle(tx, member, actingMemberId))
      });
    }

    return results;
  });

import type { PlayerResponse } from "@wise-old-man/utils";
import { isNotNull } from "drizzle-orm";

import { db } from "@db/index";
import { members, womPlayers } from "@db/schema";

import { normaliseRsn } from "./shared/normalise-rsn";

export const loadMemberMatcher = async () => {
  const linked = await db
    .select({ womPlayerId: womPlayers.womPlayerId, memberId: womPlayers.memberId })
    .from(womPlayers);

  const named = await db
    .select({ id: members.id, mainRsn: members.mainRsn })
    .from(members)
    .where(isNotNull(members.mainRsn));

  const byPlayerId = new Map(linked.map((row) => [row.womPlayerId, row.memberId]));
  const byRsn = new Map(named.map((row) => [normaliseRsn(row.mainRsn!), row.id]));

  // The player id survives a name change, so an existing link wins over the RSN.
  return (player: PlayerResponse) => byPlayerId.get(player.id) ?? byRsn.get(normaliseRsn(player.username));
};

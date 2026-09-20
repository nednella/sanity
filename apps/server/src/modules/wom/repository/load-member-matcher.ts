import { isNotNull } from "drizzle-orm";

import { db } from "@db/index";
import { members, womPlayers } from "@db/schema";

import type { WomPlayer } from "@/integrations/wom";

// OSRS treats spaces, underscores and hyphens in a name as the same character.
const normalise = (name: string) => name.toLowerCase().replaceAll(/[_-]/g, " ").trim();

export const loadMemberMatcher = async () => {
  const linked = await db
    .select({ womPlayerId: womPlayers.womPlayerId, memberId: womPlayers.memberId })
    .from(womPlayers);

  const named = await db
    .select({ id: members.id, mainRsn: members.mainRsn })
    .from(members)
    .where(isNotNull(members.mainRsn));

  const byPlayerId = new Map(linked.map((row) => [row.womPlayerId, row.memberId]));
  const byRsn = new Map(named.map((row) => [normalise(row.mainRsn!), row.id]));

  // The player id survives a name change, so an existing link wins over the RSN.
  return (player: WomPlayer) => byPlayerId.get(player.id) ?? byRsn.get(normalise(player.username));
};

import type { PlayerResponse } from "@wise-old-man/utils";
import { isNotNull } from "drizzle-orm";

import { normaliseRsn } from "@sanity/utils";

import { db } from "@db/index";
import { members } from "@db/schema";

import { loadTrackedPlayers } from "./load-tracked-players";

export async function loadMemberMatcher() {
  const byPlayerId = await loadTrackedPlayers();
  const named = await db
    .select({ id: members.id, mainRsn: members.mainRsn })
    .from(members)
    .where(isNotNull(members.mainRsn));

  const byRsn = new Map(named.map((row) => [normaliseRsn(row.mainRsn!), row.id]));

  // The player id survives a name change, so an existing link wins over the
  // RSN.
  return (player: PlayerResponse) => byPlayerId.get(player.id) ?? byRsn.get(normaliseRsn(player.username));
}

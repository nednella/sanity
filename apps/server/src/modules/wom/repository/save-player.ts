import type { PlayerResponse, SnapshotResponse } from "@wise-old-man/utils";
import { eq } from "drizzle-orm";

import { db } from "@db/index";
import { womPlayers } from "@db/schema";

import { toPlayerRow } from "./shared/player-row";

/**
 * Updates a WOM player we already store, matched on WOM's own player id.
 *
 * A miss means we hold no row for that player id yet, which is every player the
 * group sync has never seen, whether or not the RSN belongs to a clan member.
 * Reports whether a row was updated or not.
 */
export const saveWomPlayer = async (player: PlayerResponse, snapshot: SnapshotResponse | null) => {
  const updated = await db
    .update(womPlayers)
    .set(toPlayerRow(player, snapshot))
    .where(eq(womPlayers.womPlayerId, player.id))
    .returning({ womPlayerId: womPlayers.womPlayerId });

  return updated.length > 0;
};

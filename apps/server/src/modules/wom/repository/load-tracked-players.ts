import { db } from "@db/index";
import { womPlayers } from "@db/schema";

export async function loadTrackedPlayers() {
  const tracked = await db
    .select({ womPlayerId: womPlayers.womPlayerId, memberId: womPlayers.memberId })
    .from(womPlayers);

  return new Map(tracked.map((row) => [row.womPlayerId, row.memberId]));
}

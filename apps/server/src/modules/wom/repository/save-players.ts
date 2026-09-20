import { sql } from "drizzle-orm";

import { db } from "@db/index";
import { womPlayers } from "@db/schema";

import type { WomPlayer, WomSnapshot } from "@/integrations/wom";

export const savePlayers = async (players: { memberId: bigint; player: WomPlayer; snapshot: WomSnapshot }[]) => {
  const rows = players.map(({ memberId, player, snapshot }) => ({
    womPlayerId: player.id,
    memberId,
    username: player.username,
    displayName: player.displayName,
    type: player.type,
    build: player.build,
    totalLevel: snapshot.data.skills.overall!.level,
    totalExp: player.exp,
    totalEhp: player.ehp,
    totalEhb: player.ehb,
    registeredAt: new Date(player.registeredAt),
    updatedAt: player.updatedAt ? new Date(player.updatedAt) : null
  }));

  await db
    .insert(womPlayers)
    .values(rows)
    .onConflictDoUpdate({
      target: womPlayers.womPlayerId,
      set: {
        username: sql`excluded.username`,
        displayName: sql`excluded.display_name`,
        type: sql`excluded.type`,
        build: sql`excluded.build`,
        totalLevel: sql`excluded.total_level`,
        totalExp: sql`excluded.total_exp`,
        totalEhp: sql`excluded.total_ehp`,
        totalEhb: sql`excluded.total_ehb`,
        updatedAt: sql`excluded.updated_at`
      }
    });
};

// Snapshots already stored are skipped, so overlapping pulls are safe. Returns how many were new.

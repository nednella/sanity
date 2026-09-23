import { sql } from "drizzle-orm";

import { db } from "@db/index";
import { womPlayers } from "@db/schema";

import type { WomPlayer, WomSnapshot } from "@/integrations/wom";

import { toPlayerRow } from "./shared/player-row";

export const savePlayers = async (players: { memberId: bigint; player: WomPlayer; snapshot: WomSnapshot | null }[]) => {
  const rows = players.map(({ memberId, player, snapshot }) => ({ memberId, ...toPlayerRow(player, snapshot) }));

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
        status: sql`excluded.status`,
        totalLevel: sql`excluded.total_level`,
        totalExp: sql`excluded.total_exp`,
        totalEhp: sql`excluded.total_ehp`,
        totalEhb: sql`excluded.total_ehb`,
        timeToMax: sql`excluded.time_to_max`,
        timeTo200m: sql`excluded.time_to_200m`,
        updatedAt: sql`excluded.updated_at`,
        lastChangedAt: sql`excluded.last_changed_at`
      }
    });
};

// Snapshots already stored are skipped, so overlapping pulls are safe. Returns how many were new.

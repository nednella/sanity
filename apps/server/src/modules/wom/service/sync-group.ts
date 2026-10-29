import { config } from "@config";
import { db } from "@db/index";

import { wom } from "@/integrations/wom";

import { loadMemberMatcher } from "../repository/load-member-matcher";
import { savePlayers } from "../repository/save-players";
import { saveSnapshots } from "../repository/save-snapshots";
import { changeMainRsn } from "./shared/change-main-rsn";

/**
 * Reads every tracked clan member in one request and stores the snapshot each one carries, skipping
 * any snapshot we already hold. Only players Wise Old Man ties to one of our members are stored,
 * and only once each, since a member with two accounts in the group would otherwise be saved twice.
 *
 * Wise Old Man reflects the hiscores, so the name it reports for a linked player is the member's
 * real RSN and replaces whatever we hold.
 */
export async function syncGroup() {
  const entries = await wom.groups.getGroupBulkHiscores(Number(config.womGroupId));

  const memberFor = await loadMemberMatcher();
  const players: Parameters<typeof savePlayers>[1] = [];
  const snapshots: Parameters<typeof saveSnapshots>[1] = [];
  const linked = new Set<bigint>();

  for (const { player, data } of entries) {
    const memberId = memberFor(player);
    if (memberId === undefined || linked.has(memberId)) continue;

    linked.add(memberId);
    players.push({ memberId, player, snapshot: data });
    snapshots.push(data);
  }

  return db.transaction(async (tx) => {
    await savePlayers(tx, players);
    const saved = await saveSnapshots(tx, snapshots);

    let renamed = 0;
    for (const { memberId, player } of players) {
      if (await changeMainRsn(tx, memberId, player.displayName)) renamed++;
    }

    return { linked: players.length, members: entries.length, renamed, saved };
  });
}

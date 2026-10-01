import { config } from "@config";
import { db } from "@db/index";

import { wom } from "@/integrations/wom";

import { loadMemberMatcher } from "../repository/load-member-matcher";
import { savePlayers } from "../repository/save-players";
import { saveSnapshots } from "../repository/save-snapshots";
import { renameAndRecord } from "./shared/rename-and-record";

/**
 * Reads every tracked clan member in one request and stores the snapshot each one carries, skipping
 * any snapshot we already hold. Only players Wise Old Man ties to one of our members are stored,
 * and only once each, since a member with two accounts in the group would otherwise be saved twice.
 *
 * Wise Old Man reflects the hiscores, so the name it reports for a linked player is the member's
 * real RSN and replaces whatever we hold.
 */
export const syncGroup = async () => {
  const entries = await wom.groups.getGroupBulkHiscores(Number(config.womGroupId));

  const memberFor = await loadMemberMatcher();
  const players: Parameters<typeof savePlayers>[0] = [];
  const snapshots = [];
  const linked = new Set<bigint>();

  for (const { player, data } of entries) {
    const memberId = memberFor(player);
    if (memberId === undefined || linked.has(memberId)) continue;

    linked.add(memberId);
    players.push({ memberId, player, snapshot: data });
    snapshots.push(data);
  }

  await savePlayers(players);
  const saved = await saveSnapshots(snapshots);

  const renamed = await db.transaction(async (tx) => {
    let count = 0;
    for (const { memberId, player } of players) {
      if (await renameAndRecord(tx, memberId, player.displayName)) count++;
    }
    return count;
  });

  return { linked: players.length, members: entries.length, renamed, saved };
};

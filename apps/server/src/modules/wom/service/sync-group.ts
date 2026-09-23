import { config } from "@config";

import { womFetchGroupHiscores } from "@/integrations/wom";

import { loadMemberMatcher } from "../repository/load-member-matcher";
import { savePlayers } from "../repository/save-players";
import { saveSnapshots } from "../repository/save-snapshots";

/**
 * Reads every tracked clan member in one request and store the snapshot each one carries, skipping
 * any snapshot we already hold. Only players Wise Old Man ties to one of our members are stored,
 * and only once each, since a member with two accounts in the group would otherwise be saved twice.
 */
export const syncGroup = async () => {
  const entries = await womFetchGroupHiscores(config.womGroupId);

  const memberFor = await loadMemberMatcher();
  const players = [];
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

  return { linked: players.length, members: entries.length, saved };
};

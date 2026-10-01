import { config } from "@config";

import { wom } from "@/integrations/wom";

import { loadTrackedPlayers } from "../repository/load-tracked-players";
import { saveNameChanges } from "../repository/save-name-changes";

const PAGE_SIZE = 50;

type NameChange = Awaited<ReturnType<typeof wom.groups.getGroupNameChanges>>[number];

// Wise Old Man resolves a change some time after it happens, and only then is it ours to record.
const resolvedAt = (change: NameChange) => change.resolvedAt ?? change.updatedAt;

const readGroupNameChanges = async (pages: number) => {
  const changes: NameChange[] = [];

  for (let page = 0; page < pages; page++) {
    const batch = await wom.groups.getGroupNameChanges(Number(config.womGroupId), {
      limit: PAGE_SIZE,
      offset: page * PAGE_SIZE
    });

    changes.push(...batch);
    if (batch.length < PAGE_SIZE) break;
  }

  return changes;
};

/**
 * Builds the history of names behind every linked member, for their profile to show.
 *
 * It does not touch a member's current RSN: the group sync reads that from the hiscores for every
 * linked player on every run, which reaches members this feed never mentions.
 */
export const syncNameChanges = async (pages: number) => {
  const memberIdByPlayerId = await loadTrackedPlayers();
  const changes = await readGroupNameChanges(pages);

  const ours = changes
    .filter((change) => change.status === "approved" && memberIdByPlayerId.has(change.playerId))
    .toSorted((a, b) => resolvedAt(a).getTime() - resolvedAt(b).getTime() || a.id - b.id);

  const recorded = await saveNameChanges(
    ours.map((change) => ({
      id: change.id,
      womPlayerId: change.playerId,
      oldName: change.oldName,
      newName: change.newName,
      resolvedAt: resolvedAt(change)
    }))
  );

  return { read: changes.length, recorded };
};

import { config } from "@config";

import { wom } from "@/integrations/wom";

import { loadTrackedPlayers } from "../repository/load-tracked-players";
import { renameMember } from "../repository/rename-member";
import { saveNameChanges } from "../repository/save-name-changes";

const PAGE_SIZE = 50;

const resolvedAt = (change: { resolvedAt: Date | null; updatedAt: Date }) =>
  (change.resolvedAt ?? change.updatedAt).getTime();

export const syncNameChanges = async (pages: number) => {
  const memberFor = await loadTrackedPlayers();

  const changes = [];
  for (let page = 0; page < pages; page++) {
    const batch = await wom.groups.getGroupNameChanges(Number(config.womGroupId), {
      limit: PAGE_SIZE,
      offset: page * PAGE_SIZE
    });

    changes.push(...batch);
    if (batch.length < PAGE_SIZE) break;
  }

  const approved = changes
    .filter((change) => change.status === "approved" && memberFor.has(change.playerId))
    .toSorted((a, b) => resolvedAt(a) - resolvedAt(b) || a.id - b.id);

  const recorded = await saveNameChanges(
    approved.map((change) => ({
      id: change.id,
      womPlayerId: change.playerId,
      oldName: change.oldName,
      newName: change.newName,
      resolvedAt: change.resolvedAt ?? change.updatedAt
    }))
  );

  const latest = new Map(approved.map((change) => [change.playerId, change]));

  let renamed = 0;
  for (const [playerId, change] of latest) {
    const memberId = memberFor.get(playerId);
    if (memberId !== undefined && (await renameMember(memberId, change.newName))) renamed++;
  }

  return { read: changes.length, recorded, renamed };
};

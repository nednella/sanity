import { config } from "@config";
import { db } from "@db/index";

import { wom } from "@/integrations/wom";
import { recordAuditEntry } from "@/modules/audit/repository/record-audit-entry";

import { loadTrackedPlayers } from "../repository/load-tracked-players";
import { renameMember } from "../repository/rename-member";
import { saveNameChanges } from "../repository/save-name-changes";

const PAGE_SIZE = 50;

type NameChange = Awaited<ReturnType<typeof wom.groups.getGroupNameChanges>>[number];

// Wise Old Man resolves a change some time after it happens, and only then is it ours to act on.
const changedAt = (change: NameChange) => (change.resolvedAt ?? change.updatedAt).getTime();

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

const renameAndRecord = (memberId: bigint, change: NameChange) =>
  db.transaction(async (tx) => {
    const renamed = await renameMember(tx, memberId, change.newName);
    if (!renamed) return false;

    await recordAuditEntry(tx, {
      action: "rsn_changed",
      affects: [memberId],
      note: renamed.previous ? `${renamed.previous} to ${change.newName}` : `set to ${change.newName}`,
      source: "worker"
    });

    return true;
  });

/**
 * Brings every linked member's RSN up to date and keeps the history behind it.
 *
 * A member who renamed before we linked them is not here: the only name we hold for them has left
 * the hiscores, so nothing in this feed points at them. Set their RSN to the name they go by now
 * and the next group sync will match and link them.
 */
export const syncNameChanges = async (pages: number) => {
  const memberIdByPlayerId = await loadTrackedPlayers();
  const changes = await readGroupNameChanges(pages);

  const ours = changes
    .filter((change) => change.status === "approved" && memberIdByPlayerId.has(change.playerId))
    .toSorted((a, b) => changedAt(a) - changedAt(b) || a.id - b.id);

  const recorded = await saveNameChanges(
    ours.map((change) => ({
      id: change.id,
      womPlayerId: change.playerId,
      oldName: change.oldName,
      newName: change.newName,
      resolvedAt: change.resolvedAt ?? change.updatedAt
    }))
  );

  // Oldest first, so a member who renamed more than once ends on the name they go by now.
  const latestChangeByMemberId = new Map<bigint, NameChange>();
  for (const change of ours) {
    latestChangeByMemberId.set(memberIdByPlayerId.get(change.playerId)!, change);
  }

  let renamed = 0;
  for (const [memberId, change] of latestChangeByMemberId) {
    if (await renameAndRecord(memberId, change)) renamed++;
  }

  return { read: changes.length, recorded, renamed };
};

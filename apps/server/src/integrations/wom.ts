import { WOMClient } from "@wise-old-man/utils";

export type { PlayerResponse as WomPlayer, SnapshotResponse as WomSnapshot } from "@wise-old-man/utils";

const USER_AGENT = "sanity";

const wom = new WOMClient({ userAgent: USER_AGENT });

// Every group member's player and latest snapshot, in one request.
export const fetchGroupHiscores = (groupId: string) => wom.groups.getGroupBulkHiscores(Number(groupId));

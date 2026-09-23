import { WOMClient } from "@wise-old-man/utils";

export type { PlayerResponse as WomPlayer, SnapshotResponse as WomSnapshot } from "@wise-old-man/utils";

const USER_AGENT = "sanity";

const wom = new WOMClient({ userAgent: USER_AGENT });

// Every group member's player and latest snapshot, in one request.
export const fetchGroupHiscores = (groupId: string) => wom.groups.getGroupBulkHiscores(Number(groupId));

/**
 * Asks Wise Old Man to read the official OSRS hiscores again, and hands back the player
 * with the snapshot it took. A player that WOM has never seen is tracked from scratch;
 * one it read within the last minute is refused.
 *
 * A refusal throws rather than returning an empty player.
 */
export const womUpdatePlayerByRsn = async (username: string) => {
  const player = await wom.players.updatePlayer(username);
  if (!player) throw new Error("wise old man returned nothing");

  return player;
};

import { WOMClient } from "@wise-old-man/utils";

import { config } from "@config";

export type { PlayerResponse as WomPlayer, SnapshotResponse as WomSnapshot } from "@wise-old-man/utils";

const wom = new WOMClient({ apiKey: config.womApiKey, userAgent: config.womUserAgent });

/**
 * Reads every member of the clan's Wise Old Man group in one request, each with the latest snapshot
 * WOM holds for them. A player it doesn't track, or one outside the group, simply isn't in the list.
 */
export const womFetchGroupHiscores = (groupId: string) => wom.groups.getGroupBulkHiscores(Number(groupId));

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

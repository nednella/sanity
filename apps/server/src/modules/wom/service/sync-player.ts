import { wom } from "@/integrations/wom";

import { savePlayer } from "../repository/save-player";
import { saveSnapshots } from "../repository/save-snapshots";

/**
 * Refreshes a single WOM player on demand and stores the fresh snapshot if one was returned.
 *
 * We don't need to know what clan member the RSN belongs to, because we are expecting that
 * we already track the clan member's WOM player id tied to their main RSN. If we didn't
 * update an existing player, then we pass that report back up.
 */
export const syncPlayer = async (username: string) => {
  const player = await wom.players.updatePlayer(username);
  if (!player) throw new Error("wise old man returned nothing");

  const didStoreUpdate = await savePlayer(player, player.latestSnapshot);
  if (didStoreUpdate && player.latestSnapshot) await saveSnapshots([player.latestSnapshot]);

  return didStoreUpdate;
};

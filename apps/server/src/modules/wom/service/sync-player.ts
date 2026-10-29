import { db } from "@db/index";

import { wom } from "@/integrations/wom";

import { womErrors } from "../errors";
import { savePlayer } from "../repository/save-player";
import { saveSnapshots } from "../repository/save-snapshots";

/**
 * Refreshes a single WOM player on demand and stores the fresh snapshot if one was returned.
 *
 * We don't need to know what clan member the RSN belongs to, because we are expecting that
 * we already track the clan member's WOM player id tied to their main RSN.
 */
async function updatePlayer(username: string) {
  try {
    return await wom.players.updatePlayer(username);
  } catch (error) {
    throw womErrors.fromRefusal(error);
  }
}

export async function syncPlayer(username: string) {
  const player = await updatePlayer(username);
  if (!player) throw new Error("wise old man returned nothing");

  const didStoreUpdate = await db.transaction(async (tx) => {
    const stored = await savePlayer(tx, player, player.latestSnapshot);
    if (stored && player.latestSnapshot) await saveSnapshots(tx, [player.latestSnapshot]);

    return stored;
  });
  if (!didStoreUpdate) throw womErrors.notTracked(username);
}

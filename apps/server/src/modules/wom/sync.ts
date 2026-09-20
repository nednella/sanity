import { config } from "../../../config";
import { client } from "../../../db/index";
import { fetchGroupHiscores } from "../../integrations/wom";
import { loadMemberMatcher, savePlayers, saveSnapshots } from "./repo";

// History grows as Wise Old Man refreshes players between runs.
const entries = await fetchGroupHiscores(config.womGroupId);

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

console.log(`${entries.length} group members, ${players.length} linked, ${saved} new snapshots`);

await client.end();

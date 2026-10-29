import { client } from "@db/index";

import { proposeRankChanges } from "@/modules/members/service/propose-rank-changes";

const { checked, proposals } = await proposeRankChanges();
for (const proposal of proposals) {
  console.log(`${proposal.direction.padEnd(9)} ${proposal.displayName} ${proposal.from.name} -> ${proposal.to.name}`);
}
console.log(`${checked} members checked, ${proposals.length} proposed`);

await client.end();

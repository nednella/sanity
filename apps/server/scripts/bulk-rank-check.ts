import { client } from "@db/index";

import { bulkRankCheck } from "@/modules/members/service/bulk-rank-check";

const { checked, proposals } = await bulkRankCheck();
for (const proposal of proposals) {
  console.log(`${proposal.direction.padEnd(9)} ${proposal.displayName} ${proposal.from.name} -> ${proposal.to.name}`);
}
console.log(`${checked} members checked, ${proposals.length} proposed`);

await client.end();

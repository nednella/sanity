import { client } from "@db/index";

import { syncGroup } from "@/modules/wom/service/sync-group";

const { linked, members, saved } = await syncGroup();
console.log(`${members} group members, ${linked} linked, ${saved} new snapshots`);

await client.end();

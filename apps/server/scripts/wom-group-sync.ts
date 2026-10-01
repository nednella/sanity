import { client } from "@db/index";

import { syncGroup } from "@/modules/wom/service/sync-group";

const { linked, members, renamed, saved } = await syncGroup();
console.log(`${members} group members, ${linked} linked, ${saved} new snapshots, ${renamed} renamed`);

await client.end();

import { client } from "@db/index";

import { syncNameChanges } from "@/modules/wom/service/sync-name-changes";

const PAGES = Number(process.argv[2] ?? 4);

const { read, recorded, renamed } = await syncNameChanges(PAGES);
console.log(`${read} name changes read, ${recorded} recorded, ${renamed} members renamed`);

await client.end();

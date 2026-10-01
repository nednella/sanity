import { client } from "@db/index";

import { syncNameChanges } from "@/modules/wom/service/sync-name-changes";

const PAGES = Number(process.argv[2] ?? 4);

const { read, recorded } = await syncNameChanges(PAGES);
console.log(`${read} name changes read, ${recorded} recorded`);

await client.end();

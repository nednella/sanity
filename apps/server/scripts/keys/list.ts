import { client } from "@db/index";

import { listKeys } from "@/modules/auth/repository/list-keys";

console.table(await listKeys());

await client.end();

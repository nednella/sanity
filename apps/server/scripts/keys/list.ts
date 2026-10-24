import { client } from "@db/index";

import { listApiKeys } from "@/modules/auth/repository/list-api-keys";

console.table(await listApiKeys());

await client.end();

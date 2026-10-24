import { z } from "zod";

import { client } from "@db/index";

import { revokeApiKey } from "@/modules/auth/repository/revoke-api-key";

const parsed = z.coerce.number().int().positive().safeParse(process.argv[2]);
if (!parsed.success) throw new Error("usage: pnpm key:revoke <id>");

const revoked = await revokeApiKey(parsed.data);
console.log(revoked ? `Key #${parsed.data} revoked` : `Key #${parsed.data} is not found or already revoked`);

await client.end();

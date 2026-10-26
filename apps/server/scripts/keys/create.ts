import { z } from "zod";

import { apiClient } from "@db/enums";
import { client } from "@db/index";

import { saveKey } from "@/modules/auth/repository/save-key";
import { generateKey, hashKey } from "@/modules/auth/service/keys";

// A plugin key belongs to a member, and the web signs in through Discord, so neither is made by hand.
const machineClient = z.enum(apiClient.enumValues).exclude(["plugin", "web"]);

const parsed = machineClient.safeParse(process.argv[2]);
if (!parsed.success) throw new Error(`usage: pnpm key:create <${machineClient.options.join("|")}>`);

const key = generateKey(parsed.data);
const id = await saveKey({ client: parsed.data, keyHash: hashKey(key) });
console.log(`Key #${id} for ${parsed.data}. It is shown once and cannot be recovered:\n${key}`);

await client.end();

import { z } from "zod";

import { apiClient } from "@db/enums";
import { client } from "@db/index";

import { saveApiKey } from "@/modules/auth/repository/save-api-key";
import { generateApiKey, hashApiKey } from "@/modules/auth/service/keys";

// A RuneLite key belongs to a member, and the web signs in through Discord, so neither is made by hand.
const machineClient = z.enum(apiClient.enumValues).exclude(["runelite", "web"]);

const parsed = machineClient.safeParse(process.argv[2]);
if (!parsed.success) throw new Error(`usage: pnpm key:create <${machineClient.options.join("|")}>`);

const key = generateApiKey(parsed.data);
const id = await saveApiKey({ client: parsed.data, keyHash: hashApiKey(key) });
console.log(`Key #${id} for ${parsed.data}. It is shown once and cannot be recovered:\n${key}`);

await client.end();

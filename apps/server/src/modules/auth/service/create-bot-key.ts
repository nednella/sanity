import { saveKey } from "../repository/save-key";
import { generateKey, hashKey } from "./keys";

/**
 * Creates a bot key and returns it with its ID. The key is shown only once in
 * its lifetime.
 */
export async function createBotKey() {
  const key = generateKey("bot");
  const id = await saveKey({ client: "bot", keyHash: hashKey(key) });

  return { id, key };
}

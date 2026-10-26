import type { Auth } from "../hooks/authenticate";
import { replacePluginKey } from "../repository/replace-plugin-key";
import { generateApiKey, hashApiKey } from "./keys";

/**
 * Creates a plugin key for the member who requested and returns it.
 *
 * Each key will only be shown once in its lifetime. Subsequent calls
 * generate a new key and replace the old one.
 */
export async function createPluginKey(auth: Auth) {
  const key = generateApiKey("plugin");
  await replacePluginKey(auth.member.id, hashApiKey(key));

  return key;
}

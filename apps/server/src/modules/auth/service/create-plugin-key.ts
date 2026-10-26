import { authErrors } from "../errors";
import type { Auth } from "../hooks/authenticate";
import { replacePluginKey } from "../repository/replace-plugin-key";
import { generateKey, hashKey } from "./keys";

/**
 * Creates a plugin key for the member who requested and returns it.
 *
 * Each key will only be shown once in its lifetime. Subsequent calls
 * generate a new key and replace the old one.
 */
export async function createPluginKey(auth: Auth) {
  const key = generateKey("plugin");
  const replaced = await replacePluginKey(auth.member.id, hashKey(key));
  if (!replaced) throw authErrors.pluginAccessRevoked();

  return key;
}

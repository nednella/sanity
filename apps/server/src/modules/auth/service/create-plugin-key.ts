import { authErrors } from "../errors";
import { replacePluginKey } from "../repository/replace-plugin-key";
import type { Auth } from "./authenticate";
import { generateApiKey, hashApiKey } from "./keys";

/**
 * Creates a plugin key for the member who requested and returns it.
 *
 * This function can only be executed from running the `/plugin-key` bot
 * command.
 *
 * Each key will only be shown once in its lifetime. Subsequent calls
 * generate a new key and replace the old one.
 */
export async function createPluginKey(auth: Auth) {
  if (auth.client !== "bot") throw authErrors.forbidden();

  const key = generateApiKey("plugin");
  await replacePluginKey(auth.member.id, hashApiKey(key));

  return key;
}

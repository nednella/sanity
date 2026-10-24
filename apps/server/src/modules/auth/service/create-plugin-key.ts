import { authErrors } from "../errors";
import { replacePluginKey } from "../repository/replace-plugin-key";
import type { Actor } from "./authenticate";
import { generateApiKey, hashApiKey } from "./keys";

/**
 * Creates a RuneLite plugin key for the member who requested and returns it.
 *
 * This function can only be executed from running the `/plugin-key` bot
 * command.
 *
 * Each key will only be shown once in its lifetime. Subsequent calls
 * generate a new key and replace the old one.
 */
export async function createPluginKey(actor: Actor) {
  if (actor.source !== "bot") throw authErrors.forbidden();

  const key = generateApiKey("runelite");
  await replacePluginKey(actor.memberId, hashApiKey(key));

  return key;
}

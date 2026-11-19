import { randomBytes } from "node:crypto";

import { discordAuthorizeUrl } from "@/integrations/discord";

const STATE_BYTES = 32;

/**
 * Starts a Discord sign-in. The caller keeps `state` in a cookie and sends the
 * browser to `url`. Discord sends the same `state` back to the callback.
 */
export function startDiscordSignIn() {
  const state = randomBytes(STATE_BYTES).toString("base64url");
  return {
    state,
    url: discordAuthorizeUrl(state)
  };
}

import { z } from "zod";

import { DISCORD_API_URL, DISCORD_AUTHORIZE_URL } from "@sanity/urls";

import { config } from "@config";

import { bigIntString } from "@/schema/codecs";

const { discordClientId, discordClientSecret, discordRedirectUri } = config;

const tokenResponse = z.object({ access_token: z.string() });

const userResponse = z.object({ id: bigIntString });

/**
 * Builds the URL that asks the user to sign in to Discord and share their
 * Discord ID with us. Discord sends them back to the redirect URI with a `code`
 * and the same `state`.
 */
export function discordAuthorizeUrl(state: string) {
  const params = new URLSearchParams({
    client_id: discordClientId,
    prompt: "none",
    redirect_uri: discordRedirectUri,
    response_type: "code",
    scope: "identify",
    state
  });

  return `${DISCORD_AUTHORIZE_URL}?${params}`;
}

/**
 * Trades the `code` from Discord's redirect for the user's Discord ID.
 *
 * Returns `undefined` when Discord rejects the code, for example when it has
 * expired or was already used. The Discord token is not kept.
 */
export async function fetchDiscordUserId(code: string) {
  const token = await fetch(`${DISCORD_API_URL}/oauth2/token`, {
    method: "POST",
    body: new URLSearchParams({
      client_id: discordClientId,
      client_secret: discordClientSecret,
      code,
      grant_type: "authorization_code",
      redirect_uri: discordRedirectUri
    })
  });
  if (!token.ok) return;

  const { access_token } = tokenResponse.parse(await token.json());

  const user = await fetch(`${DISCORD_API_URL}/users/@me`, {
    headers: { Authorization: `Bearer ${access_token}` }
  });
  if (!user.ok) throw new Error(`Discord answered ${user.status} to /users/@me`);

  return userResponse.parse(await user.json()).id;
}

import { z } from "zod";

import { DISCORD_API_URL, DISCORD_AUTHORIZE_URL } from "@sanity/urls";

import { config } from "@config";

import { bigIntString } from "@/schema/codecs";

const { discordClientId, discordClientSecret, discordRedirectUri } = config;

/**
 * Discord OAuth 2.0 integration using the authorization code grant.
 *
 * see: https://docs.discord.com/developers/topics/oauth2#authorization-code-grant
 */

const tokenResponse = z.object({ access_token: z.string() });
const userResponse = z.object({ id: bigIntString });

/**
 * Builds the URL that asks the user to sign in to Discord and share their
 * Discord ID with us, as defined by Discord's authorization code grant:
 *
 * When someone navigates to this URL, they will be prompted to authorize your
 * application for the requested scopes. On acceptance, they will be redirected
 * to your `redirect_uri`, which will contain an additional querystring
 * parameter, `code`. `state` will also be returned if previously sent, and
 * should be validated at this point.
 *
 * `identify` allows `/users/@me` without `email`, which is all we need. With
 * `prompt: "none"`, a user who has already authorized the app skips the
 * authorization screen.
 *
 * see: https://discord.com/developers/docs/topics/oauth2#authorization-code-grant
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
 * Trades the `code` from Discord's redirect for the user's Discord ID, as
 * defined by the OAuth 2.0 standard, RFC 6749, section 4.1.3:
 *
 * The client makes a request to the token endpoint by sending the following
 * parameters using the "application/x-www-form-urlencoded" format.
 *
 * The Discord access/refresh token pair is NOT stored. We use the AT once
 * to identify the Discord user by their user ID via `/users/@me`.
 *
 * Returns `undefined` when Discord rejects the code, for example when it has
 * expired or was already used.
 *
 * see: https://www.rfc-editor.org/rfc/rfc6749#section-4.1.3
 */
export async function identifyDiscordUser(code: string) {
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

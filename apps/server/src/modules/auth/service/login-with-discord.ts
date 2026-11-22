import { identifyDiscordUser } from "@/integrations/discord";
import { authErrors } from "@/modules/auth/errors";
import { createSession } from "@/modules/auth/service/create-session";
import { findMemberAccessByDiscordId } from "@/modules/members/repository/find-member-access";

/**
 * Logs in the member who authorized the app on Discord, and returns the secret
 * for their session cookie.
 */
export async function loginWithDiscord(code: string, userAgent: string | undefined) {
  const discordId = await identifyDiscordUser(code);
  if (discordId === undefined) throw authErrors.loginFailed();

  const member = await findMemberAccessByDiscordId(discordId);
  if (member === undefined) throw authErrors.notAMember();

  return createSession(member.id, userAgent);
}

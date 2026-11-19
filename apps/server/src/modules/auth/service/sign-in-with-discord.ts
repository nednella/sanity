import { fetchDiscordUserId } from "@/integrations/discord";
import { findMemberAccessByDiscordId } from "@/modules/members/repository/find-member-access";

import { createSession } from "../repository/create-session";
import { generateKey, hashKey } from "./keys";

type SignIn = { error: "failed" | "not-a-member" } | { secret: string };

/**
 * Signs a member in with the `code` from Discord's redirect, and returns the
 * secret for their session cookie. The secret is never stored, only its hash.
 */
export async function signInWithDiscord(code: string, userAgent: string | undefined): Promise<SignIn> {
  const discordId = await fetchDiscordUserId(code);
  if (discordId === undefined) return { error: "failed" };

  const member = await findMemberAccessByDiscordId(discordId);
  if (member === undefined) return { error: "not-a-member" };

  const secret = generateKey("web");
  await createSession({
    memberId: member.id,
    secretHash: hashKey(secret),
    userAgent
  });

  return { secret };
}

import { deleteSession } from "@/modules/auth/repository/delete-session";
import { hashKey } from "@/modules/auth/utils/keys";

/**
 * Ends the session that the session cookie holds, if there is one.
 */
export async function logout(secret: string | undefined) {
  if (secret === undefined) return;

  await deleteSession(hashKey(secret));
}

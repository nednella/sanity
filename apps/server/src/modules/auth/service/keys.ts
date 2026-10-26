import { createHash, randomBytes } from "node:crypto";

import type { ApiClient } from "@db/enums";

const KEY_BYTES = 32;

/**
 * Create a new API key for a client, for example `sanity_bot_3q2LxN…`.
 *
 * The secret part is 32 random bytes (256 bits) in base64url. The
 * `sanity_<client>_` prefix lets a secret scanner or a log search find a key
 * that has leaked.
 *
 * The server never stores this value, only its hash. Show it to the person once
 * and never log it.
 */
export function generateKey(client: ApiClient) {
  const secret = randomBytes(KEY_BYTES).toString("base64url");
  return `sanity_${client}_${secret}`;
}

/**
 * Turn a key into a hashed value we store in db: its SHA-256 hash in hex.
 *
 * A fast hash is safe here because the key contains a suitable entropy. A slow
 * password hash such as bcrypt would add no protection and would slow every
 * request.
 */
export function hashKey(key: string) {
  return createHash("sha256").update(key).digest("hex");
}

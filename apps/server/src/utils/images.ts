import { DISCORD_CDN_URL } from "@sanity/urls";

// Animated avatars carry an a_ prefix and only exist as gifs.
export function discordAvatarUrl(discordId: bigint, avatarHash: string) {
  return `${DISCORD_CDN_URL}/avatars/${discordId}/${avatarHash}.${avatarHash.startsWith("a_") ? "gif" : "png"}`;
}

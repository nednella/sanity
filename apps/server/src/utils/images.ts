import { DISCORD_CDN_URL, OSRS_WIKI_IMAGES_URL } from "@sanity/urls";

export function osrsWikiImageUrl(fileName: string) {
  return `${OSRS_WIKI_IMAGES_URL}/${fileName}`;
}

// Animated avatars carry an a_ prefix and only exist as gifs.
export function discordAvatarUrl(discordId: bigint, avatarHash: string) {
  return `${DISCORD_CDN_URL}/avatars/${discordId}/${avatarHash}.${avatarHash.startsWith("a_") ? "gif" : "png"}`;
}

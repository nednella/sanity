import { DISCORD_CDN_URL, OSRS_WIKI_IMAGES_URL } from "@sanity/urls";

export const osrsWikiImageUrl = (fileName: string) => `${OSRS_WIKI_IMAGES_URL}/${fileName}`;

// Animated avatars carry an a_ prefix and only exist as gifs.
export const discordAvatarUrl = (discordId: bigint, avatarHash: string) =>
  `${DISCORD_CDN_URL}/avatars/${discordId}/${avatarHash}.${avatarHash.startsWith("a_") ? "gif" : "png"}`;

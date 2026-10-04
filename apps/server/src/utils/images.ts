const OSRS_WIKI_IMAGES_URL = "https://oldschool.runescape.wiki/images";

export const osrsWikiImageUrl = (fileName: string) => `${OSRS_WIKI_IMAGES_URL}/${fileName}`;

const DISCORD_CDN_URL = "https://cdn.discordapp.com";

// Animated avatars carry an a_ prefix and only exist as gifs.
export const discordAvatarUrl = (discordId: bigint, avatarHash: string) =>
  `${DISCORD_CDN_URL}/avatars/${discordId}/${avatarHash}.${avatarHash.startsWith("a_") ? "gif" : "png"}`;

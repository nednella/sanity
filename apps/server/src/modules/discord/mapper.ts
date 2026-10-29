import { discordAvatarUrl } from "@/utils/images";

export type DiscordAccount = {
  avatarHash: string | null;
  discordId: bigint;
};

export function toAvatarUrl({ avatarHash, discordId }: DiscordAccount) {
  return avatarHash === null ? null : discordAvatarUrl(discordId, avatarHash);
}

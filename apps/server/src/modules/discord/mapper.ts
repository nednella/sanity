import { discordAvatarUrl } from "@/utils/images";

export type DiscordAccount = {
  avatarHash: string | null;
  discordId: bigint;
};

export const toAvatarUrl = ({ avatarHash, discordId }: DiscordAccount) =>
  avatarHash === null ? null : discordAvatarUrl(discordId, avatarHash);

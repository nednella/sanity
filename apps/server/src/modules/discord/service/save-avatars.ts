import { type DiscordAccount, toAvatarUrl } from "../mapper";
import { setAvatarUrls } from "../repository/set-avatar-urls";

export const saveAvatars = async (accounts: DiscordAccount[]) =>
  setAvatarUrls(accounts.map((account) => ({ avatarUrl: toAvatarUrl(account), discordId: account.discordId })));

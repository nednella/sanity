import { type DiscordAccount, toAvatarUrl } from "../mapper";
import { setAvatarUrls } from "../repository/set-avatar-urls";

export async function saveAvatars(accounts: DiscordAccount[]) {
  return setAvatarUrls(accounts.map((account) => ({ avatarUrl: toAvatarUrl(account), discordId: account.discordId })));
}

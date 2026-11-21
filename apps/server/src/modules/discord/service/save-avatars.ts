import { type DiscordAccount, toAvatarUrl } from "@/modules/discord/mapper";
import { setAvatarUrls } from "@/modules/discord/repository/set-avatar-urls";

export async function saveAvatars(accounts: DiscordAccount[]) {
  return setAvatarUrls(accounts.map((account) => ({ avatarUrl: toAvatarUrl(account), discordId: account.discordId })));
}

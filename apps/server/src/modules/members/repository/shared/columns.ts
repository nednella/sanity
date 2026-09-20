import { members, membersDiscordAccounts, ranks, speedrunDiaryTiers, womPlayers } from "@db/schema";

export const memberColumns = {
  member: members,
  discordAccount: membersDiscordAccounts,
  rank: ranks,
  claimedDiaryTier: speedrunDiaryTiers,
  womPlayer: womPlayers
};

import { discordAccounts, members, ranks, speedrunDiaryTiers, womPlayers } from "@db/schema";

export const memberColumns = {
  member: members,
  discordAccount: discordAccounts,
  rank: ranks,
  claimedDiaryTier: speedrunDiaryTiers,
  womPlayer: womPlayers
};

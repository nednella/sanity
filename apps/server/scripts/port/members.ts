import { blankToNull, dayToUtcMidnight, read, toBoolean } from "./source";

type SourceRank = {
  id: number;
  name: string;
  pointRequirement: number | null;
  diaryPointRequirement: number | null;
  masterDiaryRequirement: number | null;
  maintenancePoints: number;
  discordRoleId: string | null;
};

type SourceUser = {
  userId: string;
  displayName: string;
  mainRSN: string | null;
  altRSN: string | null;
  rankId: number;
  points: number;
  isActive: Buffer | number | null;
  joinDate: string | null;
  leaveDate: string | null;
  birthday: string | null;
  nationality: string | null;
  diaryTierClaimed: number | null;
};

/**
One member has the free text 'Chile' where a country code belongs.
*/
const nationalityFixes: Record<string, string> = { Chile: "CL" };

export const readRanks = async () => {
  const mappings = await read<{ osrsName: string | null; discordRankId: number | null }>("osrsRankMapping", "id");
  const inGameNames = new Map(mappings.map((row) => [row.discordRankId, row.osrsName]));
  const rows = await read<SourceRank>("ranks", "id");

  return rows.map((rank) => ({
    id: rank.id,
    // Every rank is upper case except Mythic.
    name: rank.name.toUpperCase(),
    inGameName: inGameNames.get(rank.id) ?? null,
    discordRoleId: rank.discordRoleId === null ? null : BigInt(rank.discordRoleId),
    clanPointRequirement: rank.pointRequirement ?? 0,
    diaryPointRequirement: rank.diaryPointRequirement ?? 0,
    masterDiaryRequirement: rank.masterDiaryRequirement ?? 0,
    maintenancePointRequirement: rank.maintenancePoints
  }));
};

export const readMembers = async () => {
  const avatarRows = await read<{ userId: string; discordProfileImageUrl: string | null }>("discordProfileImageUrl");
  const avatars = new Map(avatarRows.map((row) => [row.userId, row.discordProfileImageUrl]));
  const users = await read<SourceUser>("users", "userId");

  return users.map((user) => {
    const nationality = user.nationality?.trim() || "AQ";
    // Rejoining overwrote the join date but kept the old leave date, so a leave before the join is stale.
    const hasRejoined = user.leaveDate !== null && user.joinDate !== null && user.leaveDate < user.joinDate;

    // custom_quote is not carried: the old system leaked the nationality default
    // into it, so all 52 non-null values read 'AQ'.
    const member = {
      displayName: user.displayName,
      mainRsn: blankToNull(user.mainRSN),
      altRsn: blankToNull(user.altRSN),
      rankId: user.rankId,
      clanPoints: user.points,
      isActive: toBoolean(user.isActive),
      joinedAt: dayToUtcMidnight(user.joinDate),
      leftAt: hasRejoined ? null : dayToUtcMidnight(user.leaveDate),
      birthday: user.birthday,
      nationality: nationalityFixes[nationality] ?? nationality,
      // 0 meant no tier claimed yet.
      claimedDiaryTierId: user.diaryTierClaimed || null
    };
    const discordAccount = {
      discordId: BigInt(user.userId),
      avatarUrl: blankToNull(avatars.get(user.userId) ?? null)
    };

    return { member, discordAccount };
  });
};

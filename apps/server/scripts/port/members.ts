import { NO_BIRTH_YEAR } from "@sanity/utils";

import { blankToNull, dayToUtcMidnight, read, toBoolean } from "./source";

// The old bot never mapped retired members to an in-game rank, so the mapping
// table has no row for it.
const inGameNameFixes: Record<string, string> = { RETIRED: "Defiler" };

type SourceRank = {
  diaryPointRequirement: number | null;
  discordRoleId: string | null;
  id: number;
  masterDiaryRequirement: number | null;
  name: string;
  pointRequirement: number | null;
};

type SourceUser = {
  altRSN: string | null;
  birthday: string | null;
  diaryTierClaimed: number | null;
  displayName: string;
  isActive: Buffer | number | null;
  joinDate: string | null;
  leaveDate: string | null;
  mainRSN: string | null;
  nationality: string | null;
  points: number;
  rankId: number;
  userId: string;
};

export async function readRanks() {
  const mappings = await read<{ discordRankId: number | null; osrsName: string | null }>("osrsRankMapping", "id");
  const inGameNames = new Map(mappings.map((row) => [row.discordRankId, row.osrsName]));
  const rows = await read<SourceRank>("ranks", "id");

  return rows.map((rank) => ({
    id: rank.id,
    // Every rank is upper case except Mythic.
    name: rank.name.toUpperCase(),
    inGameName: inGameNames.get(rank.id) ?? inGameNameFixes[rank.name.toUpperCase()] ?? null,
    discordRoleId: rank.discordRoleId === null ? null : BigInt(rank.discordRoleId),
    clanPointRequirement: rank.pointRequirement ?? 0,
    diaryPointRequirement: rank.diaryPointRequirement ?? 0,
    masterDiaryRequirement: rank.masterDiaryRequirement ?? 0
  }));
}

export async function readMembers() {
  const avatarRows = await read<{ discordProfileImageUrl: string | null; userId: string }>("discordProfileImageUrl");
  const avatars = new Map(avatarRows.map((row) => [row.userId, row.discordProfileImageUrl]));
  const users = await read<SourceUser>("users", "userId");

  return users.map((user) => {
    // Rejoining overwrote the join date but kept the old leave date, so a leave
    // before the join is stale.
    const hasRejoined = user.leaveDate !== null && user.joinDate !== null && user.leaveDate < user.joinDate;

    // custom_quote is not carried: the old system leaked the nationality
    // default into it, so all 52 non-null values read 'AQ'.
    const member = {
      displayName: user.displayName,
      mainRsn: blankToNull(user.mainRSN),
      altRsn: blankToNull(user.altRSN),
      rankId: user.rankId,
      clanPoints: user.points,
      isActive: toBoolean(user.isActive),
      joinedAt: dayToUtcMidnight(user.joinDate),
      leftAt: hasRejoined ? null : dayToUtcMidnight(user.leaveDate),
      birthday: toBirthday(user.birthday),
      nationality: toNationality(user.nationality),
      // 0 meant no tier claimed yet.
      claimedDiaryTierId: user.diaryTierClaimed || null
    };
    const discordAccount = {
      discordId: BigInt(user.userId),
      avatarUrl: blankToNull(avatars.get(user.userId) ?? null)
    };

    return { member, discordAccount };
  });
}

/**
 * he old system defaulted a missing nationality to AQ, so the value means
 * nothing. One member has the ree text 'Chile' where a country code belongs.
 */
function toNationality(value: string | null) {
  const nationality = value?.trim() || null;
  if (nationality === "AQ") return null;
  return nationality === "Chile" ? "CL" : nationality;
}

// The old bot saved a birthday without a year as 1900, which has no 29
// February.
function toBirthday(value: string | null) {
  return value?.startsWith("1900-") ? `${NO_BIRTH_YEAR}${value.slice(4)}` : value;
}

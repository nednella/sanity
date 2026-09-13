import { blankToNull, clockToInterval, read, toUtcInstant } from "./source.js";

type MemberIds = Map<string, bigint>;

type SourcePersonalBest = {
  submissionId: number;
  submitterUserId: string;
  members: string | null;
  status: number;
  bossId: number;
  scale: number;
  time: string;
  imageUrl: string | null;
  submittedDate: string | null;
  reviewedBy: string | null;
  reviewedDate: string | null;
  reviewNote: string | null;
};

const enumName = (name: string) => name.trim().toLowerCase().replaceAll(" ", "_");

export const readSpeedrunContent = async () => {
  const rows = await read<{ id: number; name: string; imageUrl: string | null }>("bosses", "id");

  return rows.map((content) => ({
    id: content.id,
    name: content.name,
    imageUrl: blankToNull(content.imageUrl)
  }));
};

/**
 * Points are earned per tier reached, so a master time on one diary is worth 1 + 2 + 3 + 4 + 5 = 15.
 */
export const readSpeedrunDiaryTiers = async () => {
  const rows = await read<{ difficulty: number; diaryPoints: number; flavourText: string }>("diarytypes", "difficulty");

  return rows.map((tier) => ({ id: tier.difficulty, name: tier.flavourText, points: tier.diaryPoints }));
};

type SourceDiaryTime = {
  bossId: number;
  scale: number;
  maxDifficulty: number;
  timeEasy: string;
  timeMedium: string;
  timeHard: string;
  timeElite: string;
  timeMaster: string;
};

/**
 * One row per content and scale, with a column per tier. A diary with fewer tiers sets maxDifficulty lower,
 * and a placeholder row sets it to 0.
 */
export const readSpeedrunDiaryTimes = async () => {
  const rows = await read<SourceDiaryTime>("diarytimes", "diaryId");

  return rows.flatMap((row) =>
    [row.timeEasy, row.timeMedium, row.timeHard, row.timeElite, row.timeMaster]
      .slice(0, row.maxDifficulty)
      .map((clock, index) => ({
        contentId: row.bossId,
        scale: row.scale,
        tierId: index + 1,
        time: clockToInterval(clock)!
      }))
  );
};

/**
 * The source stored each requirement as a percentage of the maximum diary points. Each tier now requires the
 * points for completing every diary at that tier.
 */
const requiredDiaryPoints: Record<number, number> = { 1: 12, 2: 36, 3: 72, 4: 120, 5: 180 };

export const readSpeedrunDiaryRewards = async () => {
  const rows = await read<{ diaryTier: number; points: number }>("diaryrewards", "diaryTier");

  return rows.map((reward) => ({
    tierId: reward.diaryTier,
    requiredDiaryPoints: requiredDiaryPoints[reward.diaryTier]!,
    clanPoints: reward.points
  }));
};

export const readPersonalBests = async (memberIds: MemberIds) => {
  const statusRows = await read<{ id: number; name: string }>("submissionstatus");
  const statuses = new Map(statusRows.map((row) => [row.id, enumName(row.name)]));
  const rows = await read<SourcePersonalBest>("personalbests", "submissionId");

  return rows.flatMap((row) => {
    const time = clockToInterval(row.time);
    if (!time) return [];

    return [
      {
        id: row.submissionId,
        memberId: memberIds.get(row.submitterUserId)!,
        contentId: row.bossId,
        scale: row.scale,
        time,
        imageUrl: blankToNull(row.imageUrl),
        status: statuses.get(row.status) as "approved",
        submittedAt: toUtcInstant(row.submittedDate),
        reviewedBy: row.reviewedBy ? (memberIds.get(row.reviewedBy) ?? null) : null,
        reviewedAt: toUtcInstant(row.reviewedDate),
        reviewNote: blankToNull(row.reviewNote)
      }
    ];
  });
};

/**
 * The team came from a comma-separated column of Discord ids. Ids belonging to
 * people who were never members are dropped, since the row must reference one.
 */
export const readPersonalBestParticipants = async (memberIds: MemberIds, keptIds: Set<number>) => {
  const rows = await read<{ submissionId: number; members: string | null }>("personalbests", "submissionId");
  const seen = new Set<string>();

  return rows.flatMap((row) => {
    if (!keptIds.has(row.submissionId)) return [];

    return (row.members ?? "").split(",").flatMap((listed) => {
      const memberId = memberIds.get(listed.trim());
      if (memberId === undefined) return [];

      const key = `${row.submissionId}:${memberId}`;
      if (seen.has(key)) return [];
      seen.add(key);

      return [{ personalBestId: row.submissionId, memberId }];
    });
  });
};

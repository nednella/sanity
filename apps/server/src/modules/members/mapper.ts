import { toRankIconUrl } from "../ranks/mapper.js";
import type { listRanks } from "../ranks/repo.js";
import type { listDiaryProgress } from "../speedrun-diary/repo.js";
import type { findLatestSnapshot } from "../wom/repo.js";
import type { listMembers } from "./repo.js";

type MemberRow = Awaited<ReturnType<typeof listMembers>>[number];
type DiaryProgress = Awaited<ReturnType<typeof listDiaryProgress>>[number];
type RankRow = Awaited<ReturnType<typeof listRanks>>[number];
type SnapshotRows = NonNullable<Awaited<ReturnType<typeof findLatestSnapshot>>>;

// QUIT, RETIRED and TRIALIST ranks change by hand, so they have no next rank to work toward.
const RANK_IDS_WITHOUT_PROGRESSION = new Set([-1, 0, 1]);

const toRankSummary = (rank: RankRow) => ({ id: rank.id, name: rank.name, iconUrl: toRankIconUrl(rank.inGameName) });

export const toMember = (
  { member, discordAccount, rank, claimedDiaryTier, womPlayer }: MemberRow,
  diaryProgress: DiaryProgress | undefined
) => ({
  id: member.id,
  displayName: member.displayName,
  nationality: member.nationality,
  discord: {
    id: discordAccount.discordId,
    avatarUrl: discordAccount.avatarUrl
  },
  rsn: {
    main: member.mainRsn,
    alt: member.altRsn
  },
  membership: {
    active: member.isActive,
    joinedAt: member.joinedAt,
    leftAt: member.leftAt,
    rank: toRankSummary(rank),
    points: member.clanPoints
  },
  diary: {
    points: diaryProgress?.diaryPoints ?? 0,
    masterDiaries: diaryProgress?.masterDiaries ?? 0,
    claimedTier: claimedDiaryTier && { id: claimedDiaryTier.id, name: claimedDiaryTier.name }
  },
  wom: womPlayer && {
    playerId: womPlayer.womPlayerId,
    username: womPlayer.username,
    displayName: womPlayer.displayName,
    type: womPlayer.type,
    build: womPlayer.build,
    totalLevel: womPlayer.totalLevel,
    totalExp: womPlayer.totalExp,
    totalEhp: womPlayer.totalEhp,
    totalEhb: womPlayer.totalEhb,
    updatedAt: womPlayer.updatedAt
  }
});

const toNextRank = (rank: RankRow) => ({
  ...toRankSummary(rank),
  requirements: {
    clanPoints: rank.clanPointRequirement,
    diaryPoints: rank.diaryPointRequirement,
    masterDiaries: rank.masterDiaryRequirement
  }
});

type Standing = {
  clanPoints: number;
  diaryPoints: number;
  masterDiaries: number;
};

const requiresDiaries = (rank: RankRow) => rank.diaryPointRequirement > 0 || rank.masterDiaryRequirement > 0;

// A diary requirement is met by either diary points or master diaries.
const hasMetRequirements = (rank: RankRow, standing: Standing) =>
  standing.clanPoints >= rank.clanPointRequirement &&
  (standing.diaryPoints >= rank.diaryPointRequirement || standing.masterDiaries >= rank.masterDiaryRequirement);

// Promotion is manual, so a member can already qualify for a rank several places above their own. Next ranks are
// counted from whichever is higher: the rank they hold or the best rank they qualify for.
const toProgression = (currentRankId: number, ranks: RankRow[], standing: Standing) => {
  const ladder = RANK_IDS_WITHOUT_PROGRESSION.has(currentRankId)
    ? []
    : ranks.filter((rank) => !RANK_IDS_WITHOUT_PROGRESSION.has(rank.id));

  const eligible = ladder.findLast((rank) => hasMetRequirements(rank, standing));
  const eligibleRank = eligible && eligible.id > currentRankId ? eligible : undefined;

  const higher = ladder.filter((rank) => rank.id > (eligibleRank?.id ?? currentRankId));
  const points = higher.find((rank) => !requiresDiaries(rank));
  const diary = higher.find((rank) => requiresDiaries(rank));

  return {
    eligibleRank: eligibleRank ? toRankSummary(eligibleRank) : null,
    nextRank: {
      points: points ? toNextRank(points) : null,
      diary: diary ? toNextRank(diary) : null
    }
  };
};

const toSnapshot = ({ snapshot, skills, bosses, activities }: SnapshotRows) => ({
  createdAt: snapshot.createdAt,
  skills: skills.map(({ skill, experience, level, rank, ehp }) => ({ skill, experience, level, rank, ehp })),
  bosses: bosses.map(({ boss, kills, rank, ehb }) => ({ boss, kills, rank, ehb })),
  activities: activities.map(({ activity, score, rank }) => ({ activity, score, rank }))
});

export const toMemberProfile = (
  row: MemberRow,
  diaryProgress: DiaryProgress | undefined,
  ranks: RankRow[],
  latestSnapshot: SnapshotRows | undefined
) => {
  const { wom, ...member } = toMember(row, diaryProgress);

  return {
    ...member,
    progression: toProgression(row.rank.id, ranks, {
      clanPoints: member.membership.points,
      diaryPoints: member.diary.points,
      masterDiaries: member.diary.masterDiaries
    }),
    wom: wom && { ...wom, latestSnapshot: latestSnapshot ? toSnapshot(latestSnapshot) : null }
  };
};

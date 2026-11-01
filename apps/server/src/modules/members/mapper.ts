import { TRIALIST_RANK_ID } from "@/modules/ranks/constants";
import { toRankSummary } from "@/modules/ranks/mapper";
import type { RankRow } from "@/modules/ranks/repository/list-ranks";
import { RANK_IDS_OFF_LADDER, type Standing, hasMetRequirements, toActiveRanks } from "@/modules/ranks/rules";
import { DIARY_COUNT, DIARY_POINTS_MAX } from "@/modules/speedrun-diary/constants";
import type { SnapshotRows } from "@/modules/wom/repository/find-latest-snapshot";
import type { NameChange } from "@/modules/wom/repository/list-name-changes";
import { sortActivities, sortBosses, sortComputed, sortSkills } from "@/utils/metrics";

import type { MemberRow } from "./repository/shared/select-members";

/**
 * Why a member has no next rank, since the panel says something different for each: a trialist earns
 * their place on the ladder by passing trial, a quit or retired member has stepped off it, and the top
 * rank has run out of ladder to climb.
 */
function toProgressionStatus(currentRankId: number, isOnLadder: boolean, hasHigherRanks: boolean) {
  if (currentRankId === TRIALIST_RANK_ID) return "trial" as const;
  if (!isOnLadder) return "manual" as const;
  return hasHigherRanks ? ("climbing" as const) : ("maxed" as const);
}

export function toMember({ member, discordAccount, rank, claimedDiaryTier, womPlayer, diaryProgress }: MemberRow) {
  return {
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
      maxPoints: DIARY_POINTS_MAX,
      masterDiaries: diaryProgress?.masterDiaries ?? 0,
      maxMasterDiaries: DIARY_COUNT,
      claimedTier: claimedDiaryTier && { id: claimedDiaryTier.id, name: claimedDiaryTier.name }
    },
    wom: womPlayer && {
      playerId: womPlayer.womPlayerId,
      username: womPlayer.username,
      displayName: womPlayer.displayName,
      type: womPlayer.type,
      build: womPlayer.build,
      status: womPlayer.status,
      totalLevel: womPlayer.totalLevel,
      totalExp: womPlayer.totalExp,
      totalEhp: womPlayer.totalEhp,
      totalEhb: womPlayer.totalEhb,
      timeToMax: womPlayer.timeToMax,
      timeTo200m: womPlayer.timeTo200m,
      updatedAt: womPlayer.updatedAt,
      lastChangedAt: womPlayer.lastChangedAt,
      syncedAt: womPlayer.syncedAt
    }
  };
}

function toNextRank(rank: RankRow) {
  return {
    ...toRankSummary(rank),
    requirements: {
      clanPoints: rank.clanPointRequirement,
      diaryPoints: rank.diaryPointRequirement,
      masterDiaries: rank.masterDiaryRequirement
    }
  };
}

function requiresDiaries(rank: RankRow) {
  return rank.diaryPointRequirement > 0 || rank.masterDiaryRequirement > 0;
}

// Promotion is manual, so a member can already qualify for a rank several places above their own. Next ranks are
// counted from whichever is higher: the rank they hold or the best rank they qualify for.
function toProgression(currentRankId: number, ranks: RankRow[], standing: Standing) {
  const ladder = RANK_IDS_OFF_LADDER.has(currentRankId) ? [] : toActiveRanks(ranks);

  const eligible = ladder.findLast((rank) => hasMetRequirements(rank, standing));
  const eligibleRank = eligible && eligible.id > currentRankId ? eligible : undefined;

  const higher = ladder.filter((rank) => rank.id > (eligibleRank?.id ?? currentRankId));
  const points = higher.find((rank) => !requiresDiaries(rank));
  const diary = higher.find((rank) => requiresDiaries(rank));

  return {
    status: toProgressionStatus(currentRankId, ladder.length > 0, higher.length > 0),
    eligibleRank: eligibleRank ? toRankSummary(eligibleRank) : null,
    nextRank: {
      points: points ? toNextRank(points) : null,
      diary: diary ? toNextRank(diary) : null
    }
  };
}

function asRsn(name: string) {
  return name.toLowerCase().replaceAll(/[_-]/g, " ").trim();
}

function toPreviousNames(changes: NameChange[], current: string | null) {
  const seen = new Set([current ? asRsn(current) : ""]);

  return changes.filter(({ name }) => {
    const rsn = asRsn(name);
    if (seen.has(rsn)) return false;

    seen.add(rsn);
    return true;
  });
}

function toSnapshot({ snapshot, computed, skills, bosses, activities }: SnapshotRows) {
  return {
    createdAt: snapshot.createdAt,
    computed: sortComputed(computed.map(({ metric, value, rank }) => ({ metric, value, rank }))),
    skills: sortSkills(
      skills.map(({ skill, experience, level, rank, ehp }) => ({ skill, experience, level, rank, ehp }))
    ),
    bosses: sortBosses(bosses.map(({ boss, kills, rank, ehb }) => ({ boss, kills, rank, ehb }))),
    activities: sortActivities(activities.map(({ activity, score, rank }) => ({ activity, score, rank })))
  };
}

export function toMemberProfile(
  row: MemberRow,
  ranks: RankRow[],
  latestSnapshot: SnapshotRows | undefined,
  nameChanges: NameChange[]
) {
  const { wom, ...member } = toMember(row);

  return {
    ...member,
    rsn: { ...member.rsn, previous: toPreviousNames(nameChanges, member.rsn.main) },
    progression: toProgression(row.rank.id, ranks, {
      clanPoints: member.membership.points,
      diaryPoints: member.diary.points,
      masterDiaries: member.diary.masterDiaries
    }),
    wom: wom && { ...wom, latestSnapshot: latestSnapshot && toSnapshot(latestSnapshot) }
  };
}

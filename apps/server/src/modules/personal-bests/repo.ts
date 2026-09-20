import { type SQL, and, asc, desc, eq, inArray, lte, sql } from "drizzle-orm";

import { db } from "../../../db/index";
import { members, personalBestParticipants, personalBests, speedrunContent } from "../../../db/schema";

type ContentFilters = {
  contentId?: number;
  scale?: number;
};

type RecentOptions = ContentFilters & {
  limit: number;
  offset: number;
};

type RecordOptions = ContentFilters & {
  top: number;
};

type MemberOptions = ContentFilters & {
  limit: number;
  offset: number;
  top?: number;
};

// The old bot marks a run approved_missing_member when its team is short, usually because a teammate has since
// left. It still counts as a personal best, but not as a clan record.
const isPersonalBest = inArray(personalBests.status, ["approved", "approved_missing_member"]);
const isClanRecord = eq(personalBests.status, "approved");

// Credit by team only. The submitter is often not the runner: one admin entered thousands of other people's
// times, and is absent from his own team on almost all of them.
const isInTeamOf = (memberId: bigint) =>
  inArray(
    personalBests.id,
    db
      .select({ id: personalBestParticipants.personalBestId })
      .from(personalBestParticipants)
      .where(eq(personalBestParticipants.memberId, memberId))
  );

const isFor = ({ contentId, scale }: ContentFilters) =>
  and(
    contentId === undefined ? undefined : eq(personalBests.contentId, contentId),
    scale === undefined ? undefined : eq(personalBests.scale, scale)
  );

const columns = {
  personalBest: personalBests,
  timeSeconds: sql<number>`extract(epoch from ${personalBests.time})::float8`,
  content: speedrunContent,
  submittedBy: { id: members.id, displayName: members.displayName }
};

// Ranks the matching runs within each content and team size, fastest first and the earlier submission winning a
// tie, then keeps the top of each when a limit is given.
const selectRanked = (isCandidate: SQL | undefined, top: number | undefined) => {
  const ranked = db.$with("ranked").as(
    db
      .select({
        id: personalBests.id,
        position: sql<number>`row_number() over (
          partition by ${personalBests.contentId}, ${personalBests.scale}
          order by ${personalBests.time}, ${personalBests.submittedAt}
        )`
          .mapWith(Number)
          .as("position")
      })
      .from(personalBests)
      .where(isCandidate)
  );

  return db
    .with(ranked)
    .select({ ...columns, position: ranked.position })
    .from(personalBests)
    .innerJoin(ranked, eq(ranked.id, personalBests.id))
    .innerJoin(speedrunContent, eq(speedrunContent.id, personalBests.contentId))
    .innerJoin(members, eq(members.id, personalBests.memberId))
    .where(top === undefined ? undefined : lte(ranked.position, top))
    .orderBy(asc(speedrunContent.name), asc(personalBests.scale), asc(ranked.position));
};

export const listRecentPersonalBests = ({ limit, offset, ...filters }: RecentOptions) =>
  db
    .select(columns)
    .from(personalBests)
    .innerJoin(speedrunContent, eq(speedrunContent.id, personalBests.contentId))
    .innerJoin(members, eq(members.id, personalBests.memberId))
    .where(and(isPersonalBest, isFor(filters)))
    .orderBy(desc(personalBests.reviewedAt), desc(personalBests.id))
    .limit(limit)
    .offset(offset);

export const listRecords = ({ top, ...filters }: RecordOptions) => selectRanked(and(isClanRecord, isFor(filters)), top);

export const listMemberPersonalBests = (memberId: bigint, { limit, offset, top, ...filters }: MemberOptions) =>
  selectRanked(and(isPersonalBest, isInTeamOf(memberId), isFor(filters)), top)
    .limit(limit)
    .offset(offset);

export const listTeams = async (personalBestIds: number[]) => {
  if (personalBestIds.length === 0) return [];

  return db
    .select({
      personalBestId: personalBestParticipants.personalBestId,
      id: members.id,
      displayName: members.displayName
    })
    .from(personalBestParticipants)
    .innerJoin(members, eq(members.id, personalBestParticipants.memberId))
    .where(inArray(personalBestParticipants.personalBestId, personalBestIds))
    .orderBy(asc(members.displayName));
};

import { and, eq, exists, inArray, sql } from "drizzle-orm";

import { db } from "@db/index";
import { personalBestParticipants, personalBests, speedrunContent, speedrunDiaryTimes } from "@db/schema";

export type ContentFilters = {
  contentId?: number;
  diary?: boolean;
  scale?: number;
};

// Content the clan has stopped scoring keeps its submissions for history, but no read returns them.
export const isActiveContent = inArray(
  personalBests.contentId,
  db.select({ id: speedrunContent.id }).from(speedrunContent).where(eq(speedrunContent.isActive, true))
);

// The old bot marks a run approved_missing_member when its team is short, usually because a teammate has
// since left. It still counts as approved, and so still earns the diary tier it beat.
export const isApprovedRun = inArray(personalBests.status, ["approved", "approved_missing_member"]);

// Only a run with its whole team still on it can stand as the clan's record.
export const isClanRecord = eq(personalBests.status, "approved");

// Everything a list shows: the approved runs, plus the ones still waiting on a submitter or a reviewer.
export const isListedRun = inArray(personalBests.status, [
  "approved",
  "approved_missing_member",
  "pending",
  "submitted"
]);

// A run reaches review once its submitter has confirmed it, and leaves review once someone has.
export const isAwaitingReview = eq(personalBests.status, "submitted");

// Credit by team only. The submitter is often not the runner: one admin entered thousands of other people's
// times, and is absent from his own team on almost all of them.
export const isInTeamOf = (memberId: bigint) =>
  inArray(
    personalBests.id,
    db
      .select({ id: personalBestParticipants.personalBestId })
      .from(personalBestParticipants)
      .where(eq(personalBestParticipants.memberId, memberId))
  );

// The speedrun diary sets a time for each content and team size it rewards, so a run only counts toward it
// when both match a row.
const matchesDiaryTime = and(
  eq(speedrunDiaryTimes.contentId, personalBests.contentId),
  eq(speedrunDiaryTimes.scale, personalBests.scale)
);

const isDiaryContent = exists(
  db
    .select({ one: sql`1` })
    .from(speedrunDiaryTimes)
    .where(matchesDiaryTime)
);

export const isFor = ({ contentId, diary, scale }: ContentFilters) =>
  and(
    contentId === undefined ? undefined : eq(personalBests.contentId, contentId),
    diary ? isDiaryContent : undefined,
    scale === undefined ? undefined : eq(personalBests.scale, scale)
  );

export type PersonalBestFilters = ContentFilters & {
  memberId?: bigint;
  top?: number;
};

export const isCandidate = ({ memberId, ...filters }: PersonalBestFilters) =>
  and(isListedRun, isActiveContent, isFor(filters), memberId === undefined ? undefined : isInTeamOf(memberId));

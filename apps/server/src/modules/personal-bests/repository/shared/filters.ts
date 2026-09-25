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

// The old bot marks a run approved_missing_member when its team is short, usually because a teammate has since
// left. It still counts as a personal best, but not as a clan record.
export const isPersonalBest = inArray(personalBests.status, ["approved", "approved_missing_member"]);
export const isClanRecord = eq(personalBests.status, "approved");

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

import { and, eq, inArray } from "drizzle-orm";

import { db } from "@db/index";
import { personalBestParticipants, personalBests } from "@db/schema";

export type ContentFilters = {
  contentId?: number;
  scale?: number;
};

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

export const isFor = ({ contentId, scale }: ContentFilters) =>
  and(
    contentId === undefined ? undefined : eq(personalBests.contentId, contentId),
    scale === undefined ? undefined : eq(personalBests.scale, scale)
  );

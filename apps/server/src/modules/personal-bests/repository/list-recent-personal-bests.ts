import { and, desc, eq } from "drizzle-orm";

import { db } from "@db/index";
import { members, personalBests, speedrunContent } from "@db/schema";

import { columns } from "./shared/columns";
import { type ContentFilters, isActiveContent, isFor, isPersonalBest } from "./shared/filters";

export type ListRecentPersonalBestsOptions = ContentFilters & {
  limit: number;
  offset: number;
};

export const listRecentPersonalBests = ({ limit, offset, ...filters }: ListRecentPersonalBestsOptions) =>
  db
    .select(columns)
    .from(personalBests)
    .innerJoin(speedrunContent, eq(speedrunContent.id, personalBests.contentId))
    .innerJoin(members, eq(members.id, personalBests.memberId))
    .where(and(isPersonalBest, isActiveContent, isFor(filters)))
    .orderBy(desc(personalBests.reviewedAt), desc(personalBests.id))
    .limit(limit)
    .offset(offset);

export type PersonalBestRow = Awaited<ReturnType<typeof listRecentPersonalBests>>[number];

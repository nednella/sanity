import { and } from "drizzle-orm";

import { type ContentFilters, isActiveContent, isClanRecord, matchesContent } from "./shared/filters";
import { selectRankedPersonalBests } from "./shared/select-ranked-personal-bests";

export type ListRecordsOptions = ContentFilters & {
  top: number;
};

export function listRecords({ top, ...filters }: ListRecordsOptions) {
  return selectRankedPersonalBests(and(isClanRecord, isActiveContent, matchesContent(filters)), top);
}

export type RankedPersonalBestRow = Awaited<ReturnType<typeof listRecords>>[number];

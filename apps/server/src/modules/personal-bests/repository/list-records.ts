import { and } from "drizzle-orm";

import { type ContentFilters, isActiveContent, isClanRecord, isFor } from "./shared/filters";
import { selectRanked } from "./shared/select-ranked";

export type ListRecordsOptions = ContentFilters & {
  top: number;
};

export function listRecords({ top, ...filters }: ListRecordsOptions) {
  return selectRanked(and(isClanRecord, isActiveContent, isFor(filters)), top);
}

export type RankedPersonalBestRow = Awaited<ReturnType<typeof listRecords>>[number];

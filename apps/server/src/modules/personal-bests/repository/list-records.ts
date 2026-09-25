import { and } from "drizzle-orm";

import { type ContentFilters, isActiveContent, isClanRecord, isFor } from "./shared/filters";
import { selectRanked } from "./shared/select-ranked";

export type ListRecordsOptions = ContentFilters & {
  top: number;
};

export const listRecords = ({ top, ...filters }: ListRecordsOptions) =>
  selectRanked(and(isClanRecord, isActiveContent, isFor(filters)), top);

export type RankedPersonalBestRow = Awaited<ReturnType<typeof listRecords>>[number];

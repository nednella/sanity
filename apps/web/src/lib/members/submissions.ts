import type { SearchSchemaInput } from "@tanstack/react-router";

import type { PersonalBestSort, SubmissionSort } from "@/lib/api/types";
import { toLimit, toOffset, toOrder, toSort } from "@/lib/table/search";

// The generated unions are the source of truth; these lists are what validate a sort arriving in the
// URL, and the assertions below fail to compile if the API grows one a list is missing.
const SUBMISSION_SORTS = ["item", "submittedAt", "valueMillions"] as const satisfies readonly SubmissionSort[];
const PERSONAL_BEST_SORTS = ["content", "scale", "submittedAt", "time"] as const satisfies readonly PersonalBestSort[];

type Unlisted<T extends never> = T;
export type UnlistedSubmissionSort = Unlisted<Exclude<SubmissionSort, (typeof SUBMISSION_SORTS)[number]>>;
export type UnlistedPersonalBestSort = Unlisted<Exclude<PersonalBestSort, (typeof PERSONAL_BEST_SORTS)[number]>>;

const DEFAULT_LIMIT = 50;
const PAGE_SIZES = [50, 100, 200];

// The two tables share a page, so the same params drive both and the table decides what a sort means.
export const SUBMISSION_TYPES = ["drops", "personalBests"] as const;

export type SubmissionType = (typeof SUBMISSION_TYPES)[number];

export type SubmissionsSearch = {
  limit: number;
  offset: number;
  order?: "asc" | "desc";
  sort?: PersonalBestSort | SubmissionSort;
  type: SubmissionType;
};

export const validateSubmissionsSearch = (search: Record<string, unknown> & SearchSchemaInput): SubmissionsSearch => {
  const type = SUBMISSION_TYPES.find((value) => value === search.type) ?? "drops";

  // An order without a sort would sit in the URL doing nothing, and each table sorts on its own columns.
  const sort = toSort(search.sort, type === "drops" ? SUBMISSION_SORTS : PERSONAL_BEST_SORTS);

  return {
    limit: toLimit(search.limit, PAGE_SIZES, DEFAULT_LIMIT),
    offset: toOffset(search.offset),
    order: sort && toOrder(search.order),
    sort,
    type
  };
};

export const toDropsQueryParams = ({ limit, offset, order, sort }: SubmissionsSearch) => ({
  limit,
  offset,
  order,
  sort: sort as SubmissionSort | undefined
});

export const toPersonalBestsQueryParams = ({ limit, offset, order, sort }: SubmissionsSearch) => ({
  limit,
  offset,
  order,
  sort: sort as PersonalBestSort | undefined
});

import type { SearchSchemaInput } from "@tanstack/react-router";

import type { MemberSort } from "@/lib/api/types";
import type { MemberStatus } from "@/lib/members/status";
import { toActive } from "@/lib/members/status";
import { toLimit, toOffset, toOrder, toSort } from "@/lib/table/search";

// The generated union is the source of truth; this list is what validates a sort arriving in the
// URL, and the assertion below fails to compile if the API grows one this list is missing.
const MEMBER_SORTS = [
  "clanPoints",
  "diaryPoints",
  "displayName",
  "joinedAt",
  "masterDiaries",
  "rank",
  "totalEhb",
  "totalEhp",
  "totalExp",
  "totalLevel"
] as const satisfies readonly MemberSort[];

type Unlisted<T extends never> = T;
export type UnlistedSort = Unlisted<Exclude<MemberSort, (typeof MEMBER_SORTS)[number]>>;

const DEFAULT_LIMIT = 50;
const PAGE_SIZES = [50, 100, 200];

const toStatus = (value: unknown): MemberStatus => {
  if (value === "all") return "all";
  if (value === "inactive") return "inactive";
  return "active";
};

export type MembersSearch = {
  limit: number;
  offset: number;
  order?: "asc" | "desc";
  search: string;
  sort?: MemberSort;
  status: MemberStatus;
};

export const validateMembersSearch = (search: Record<string, unknown> & SearchSchemaInput): MembersSearch => {
  // An order without a sort would sit in the URL doing nothing.
  const sort = toSort(search.sort, MEMBER_SORTS);

  return {
    limit: toLimit(search.limit, PAGE_SIZES, DEFAULT_LIMIT),
    offset: toOffset(search.offset),
    order: sort && toOrder(search.order),
    search: typeof search.search === "string" ? search.search : "",
    sort,
    status: toStatus(search.status)
  };
};

export const toMembersQueryParams = (search: MembersSearch) => ({
  active: toActive(search.status),
  limit: search.limit,
  offset: search.offset,
  order: search.order,
  search: search.search,
  sort: search.sort
});

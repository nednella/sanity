import type { SearchSchemaInput } from "@tanstack/react-router";

import { memberSort } from "@sanity/api";

import type { MemberSort, MemberStatus } from "@/lib/api/query/members.js";
import { toActive } from "@/lib/api/query/members.js";
import { toLimit, toOffset, toOrder, toSort } from "@/lib/table/search.js";

const DEFAULT_LIMIT = 50;
const DEFAULT_SORT: MemberSort = "clanPoints";
const PAGE_SIZES = [50, 100, 200];

const toStatus = (value: unknown): MemberStatus => {
  if (value === "all") return "all";
  if (value === "inactive") return "inactive";
  return "active";
};

export type MembersSearch = {
  limit: number;
  offset: number;
  order: "asc" | "desc";
  sort: MemberSort;
  status: MemberStatus;
};

export const validateMembersSearch = (search: Record<string, unknown> & SearchSchemaInput): MembersSearch => ({
  limit: toLimit(search.limit, PAGE_SIZES, DEFAULT_LIMIT),
  offset: toOffset(search.offset),
  order: toOrder(search.order),
  sort: toSort(search.sort, memberSort.options, DEFAULT_SORT),
  status: toStatus(search.status)
});

export const toMembersQueryParams = (search: MembersSearch) => ({
  active: toActive(search.status),
  limit: search.limit,
  offset: search.offset,
  order: search.order,
  sort: search.sort
});

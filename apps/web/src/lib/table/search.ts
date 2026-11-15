import type { PaginationState, SortingState } from "@tanstack/react-table";

export type PageSearch = {
  limit: number;
  offset: number;
};

// No sort in the URL means the caller hasn't picked one, so no column shows as
// sorted and the server falls back to its own order.
export type SortSearch<TSort extends string> = {
  order?: "asc" | "desc";
  sort?: TSort;
};

export function toLimit(value: unknown, sizes: readonly number[], fallback: number) {
  const parsed = Number(value);
  return sizes.includes(parsed) ? parsed : fallback;
}

export function toOffset(value: unknown) {
  const parsed = Number(value);
  return Number.isSafeInteger(parsed) && parsed >= 0 ? parsed : 0;
}

export function toOrder(value: unknown) {
  return value === "asc" ? "asc" : "desc";
}

export function toPositiveInteger(value: unknown) {
  const parsed = Number(value);
  return Number.isSafeInteger(parsed) && parsed > 0 ? parsed : undefined;
}

export function toSort<TSort extends string>(value: unknown, sorts: readonly TSort[]) {
  return sorts.includes(value as TSort) ? (value as TSort) : undefined;
}

export function toPaginationState({ limit, offset }: PageSearch): PaginationState {
  return {
    pageIndex: Math.floor(offset / limit),
    pageSize: limit
  };
}

export function toSortingState<TSort extends string>({ order, sort }: SortSearch<TSort>): SortingState {
  return sort ? [{ id: sort, desc: order === "desc" }] : [];
}

export function fromPaginationState({ pageIndex, pageSize }: PaginationState): PageSearch {
  return {
    limit: pageSize,
    offset: pageIndex * pageSize
  };
}

export function fromSortingState<TSort extends string>(sorting: SortingState[number]) {
  return {
    offset: 0,
    order: sorting.desc ? ("desc" as const) : ("asc" as const),
    sort: sorting.id as TSort
  };
}

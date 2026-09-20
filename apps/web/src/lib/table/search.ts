import type { PaginationState, SortingState } from "@tanstack/react-table";

export type PageSearch = {
  limit: number;
  offset: number;
};

export type SortSearch<TSort extends string> = {
  order: "asc" | "desc";
  sort: TSort;
};

export const toLimit = (value: unknown, sizes: readonly number[], fallback: number) => {
  const parsed = Number(value);
  return sizes.includes(parsed) ? parsed : fallback;
};

export const toOffset = (value: unknown) => {
  const parsed = Number(value);
  return Number.isSafeInteger(parsed) && parsed >= 0 ? parsed : 0;
};

export const toOrder = (value: unknown) => (value === "asc" ? "asc" : "desc");

export const toSort = <TSort extends string>(value: unknown, sorts: readonly TSort[], fallback: TSort) =>
  sorts.includes(value as TSort) ? (value as TSort) : fallback;

export const toPaginationState = ({ limit, offset }: PageSearch): PaginationState => ({
  pageIndex: Math.floor(offset / limit),
  pageSize: limit
});

export const toSortingState = <TSort extends string>({ order, sort }: SortSearch<TSort>): SortingState => [
  {
    id: sort,
    desc: order === "desc"
  }
];

export const fromPaginationState = ({ pageIndex, pageSize }: PaginationState): PageSearch => ({
  limit: pageSize,
  offset: pageIndex * pageSize
});

export const fromSortingState = <TSort extends string>(sorting: SortingState[number]) => ({
  offset: 0,
  order: sorting.desc ? ("desc" as const) : ("asc" as const),
  sort: sorting.id as TSort
});

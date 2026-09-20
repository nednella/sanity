import { useNavigate } from "@tanstack/react-router";
import type { OnChangeFn, PaginationState, SortingState } from "@tanstack/react-table";
import { functionalUpdate } from "@tanstack/react-table";

import type { PageSearch, SortSearch } from "@/lib/table/search";
import { fromPaginationState, fromSortingState, toPaginationState, toSortingState } from "@/lib/table/search";

// A server-driven table keeps its page and sort in the URL, so this is the one place that translates
// between the table's state and the route's search params. Any other param the route declares can be
// written through `replaceSearch`, which is how a filter or a search box updates the URL.
export function useTableSearch<TSearch extends PageSearch & SortSearch<string>>(search: TSearch) {
  const navigate = useNavigate();

  const pagination = toPaginationState(search);
  const sorting = toSortingState(search);

  // useNavigate() outside a route can't know which search schema applies, and this hook is generic
  // over the caller's. What goes in is typed by TSearch; the cast only crosses that gap.
  const replaceSearch = (next: Partial<TSearch>) =>
    navigate({ replace: true, search: ((previous: object) => ({ ...previous, ...next })) as never });

  const onPaginationChange: OnChangeFn<PaginationState> = (updater) =>
    replaceSearch(fromPaginationState(functionalUpdate(updater, pagination)) as Partial<TSearch>);

  const onSortingChange: OnChangeFn<SortingState> = (updater) => {
    const [next] = functionalUpdate(updater, sorting);
    if (next) replaceSearch(fromSortingState<TSearch["sort"]>(next) as Partial<TSearch>);
  };

  return { onPaginationChange, onSortingChange, pagination, replaceSearch, sorting };
}

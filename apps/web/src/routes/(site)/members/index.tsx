import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import type { OnChangeFn, PaginationState, SortingState } from "@tanstack/react-table";
import { functionalUpdate } from "@tanstack/react-table";

import type { Member, MemberSort } from "@sanity/api";

import { MemberStatusFilter } from "@/components/members/member-status-filter";
import { defaultColumnVisibility, memberColumns } from "@/components/members/member-table";
import { DataTable } from "@/components/table/data-table";
import { DataTableColumnToggle } from "@/components/table/data-table-column-toggle";
import { membersQuery } from "@/lib/api/query/members";
import { toMembersQueryParams, validateMembersSearch } from "@/lib/members/search";
import type { MemberStatus } from "@/lib/members/status";
import { fromPaginationState, fromSortingState, toPaginationState, toSortingState } from "@/lib/table/search";
import { Muted } from "@/lib/ui/typography/muted";

export const Route = createFileRoute("/(site)/members/")({
  component: MembersPage,
  validateSearch: validateMembersSearch
});

const EMPTY_MEMBERS: Member[] = [];

function MembersPage() {
  const search = Route.useSearch();
  const navigate = Route.useNavigate();
  const query = useQuery(membersQuery(toMembersQueryParams(search)));

  const pagination = toPaginationState(search);
  const sorting = toSortingState(search);

  const onPaginationChange: OnChangeFn<PaginationState> = (updater) => {
    const next = fromPaginationState(functionalUpdate(updater, pagination));
    navigate({
      replace: true,
      search: (previous) => ({
        ...previous,
        ...next
      })
    });
  };

  const onSortingChange: OnChangeFn<SortingState> = (updater) => {
    const [next] = functionalUpdate(updater, sorting);
    if (!next) return;
    navigate({
      replace: true,
      search: (previous) => ({
        ...previous,
        ...fromSortingState<MemberSort>(next)
      })
    });
  };

  const onStatusChange = (status: MemberStatus) => {
    navigate({
      replace: true,
      search: (previous) => ({
        ...previous,
        offset: 0,
        status
      })
    });
  };

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Members</h1>
        <Muted className="mt-1">Every recorded member of the clan, pulled live from the roster.</Muted>
      </div>

      <DataTable
        columns={memberColumns}
        data={query.data?.items ?? EMPTY_MEMBERS}
        emptyMessage="No members found."
        error={query.error}
        initialColumnVisibility={defaultColumnVisibility}
        isLoading={query.isPending}
        onPaginationChange={onPaginationChange}
        onRetry={() => query.refetch()}
        onRowClick={(member) =>
          navigate({
            to: "/members/$memberId",
            params: { memberId: member.id.toString() }
          })
        }
        onSortingChange={onSortingChange}
        pagination={pagination}
        rowCount={query.data?.page.total ?? 0}
        sorting={sorting}
        toolbar={(table) => (
          <div className="flex flex-wrap items-center justify-between gap-3">
            <MemberStatusFilter
              status={search.status}
              onChange={onStatusChange}
            />
            <DataTableColumnToggle table={table} />
          </div>
        )}
      />
    </div>
  );
}

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import type { OnChangeFn, PaginationState, SortingState } from "@tanstack/react-table";
import { functionalUpdate } from "@tanstack/react-table";

import { MemberStatusFilter } from "@/components/members/member-status-filter";
import { defaultColumnVisibility, memberColumns } from "@/components/members/member-table";
import { DataTable } from "@/components/table/data-table";
import { DataTableColumnToggle } from "@/components/table/data-table-column-toggle";
import { api } from "@/lib/api/openapi-client";
import type { Member, MemberSort } from "@/lib/api/types";
import type { MembersSearch } from "@/lib/members/search";
import { toMembersQueryParams, validateMembersSearch } from "@/lib/members/search";
import type { MemberStatus } from "@/lib/members/status";
import { fromPaginationState, fromSortingState, toPaginationState, toSortingState } from "@/lib/table/search";
import { Muted } from "@/lib/ui/typography/muted";

const membersOptions = (search: MembersSearch) =>
  api.queryOptions("get", "/v1/members", { params: { query: toMembersQueryParams(search) } });

export const Route = createFileRoute("/(site)/members/")({
  component: MembersPage,
  validateSearch: validateMembersSearch,
  loaderDeps: ({ search }) => search,
  loader: async ({ context, deps }) => {
    await context.queryClient.query({ ...membersOptions(deps), staleTime: "static" });
  }
});

const EMPTY_MEMBERS: Member[] = [];

function MembersPage() {
  const search = Route.useSearch();
  const navigate = Route.useNavigate();

  const { data, error, isPending, refetch } = useQuery({
    ...membersOptions(search),
    placeholderData: keepPreviousData
  });

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
        data={data?.items ?? EMPTY_MEMBERS}
        emptyMessage="No members found."
        error={error}
        initialColumnVisibility={defaultColumnVisibility}
        isLoading={isPending}
        onPaginationChange={onPaginationChange}
        onRetry={() => refetch()}
        onRowClick={(member) =>
          navigate({
            to: "/members/$memberId",
            params: { memberId: member.id.toString() }
          })
        }
        onSortingChange={onSortingChange}
        pagination={pagination}
        rowCount={data?.page.total ?? 0}
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

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

import { MemberStatusFilter } from "@/components/members/member-status-filter";
import { defaultColumnVisibility, memberColumns } from "@/components/members/member-table";
import { DataTable } from "@/components/table/data-table";
import { membersOptions } from "@/lib/api/queries/members";
import { validateMembersSearch } from "@/lib/members/search";
import { useTableSearch } from "@/lib/table/use-table-search";
import { Muted } from "@/lib/ui/typography/muted";

export const Route = createFileRoute("/(site)/members/")({
  component: MembersPage,
  validateSearch: validateMembersSearch,
  loaderDeps: ({ search }) => search,
  loader: async ({ context, deps }) => {
    await context.queryClient.query({ ...membersOptions(deps), staleTime: "static" });
  }
});

function MembersPage() {
  const search = Route.useSearch();
  const navigate = Route.useNavigate();

  const { data, error, isPending, refetch } = useQuery({
    ...membersOptions(search),
    placeholderData: keepPreviousData
  });

  const { replaceSearch, ...table } = useTableSearch(search);

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Members</h1>
        <Muted className="mt-1">Every recorded member of the clan, pulled live from the roster.</Muted>
      </div>

      <DataTable
        {...table}
        columns={memberColumns}
        data={data?.items}
        emptyMessage="No members found."
        error={error}
        initialColumnVisibility={defaultColumnVisibility}
        isLoading={isPending}
        onRetry={() => refetch()}
        onRowClick={(member) => navigate({ to: "/members/$memberId", params: { memberId: member.id } })}
        rowCount={data?.page.total ?? 0}
        toolbar={() => (
          <MemberStatusFilter
            status={search.status}
            onChange={(status) => replaceSearch({ offset: 0, status })}
          />
        )}
      />
    </div>
  );
}

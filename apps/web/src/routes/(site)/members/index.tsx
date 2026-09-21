import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

import { MemberTable } from "@/components/members/member-table";
import { membersOptions } from "@/lib/api/queries/members";
import { validateMembersSearch } from "@/lib/members/search";
import { Muted } from "@/lib/ui/typography/muted";

export const Route = createFileRoute("/(site)/members/")({
  component: Page,
  validateSearch: validateMembersSearch,
  loaderDeps: ({ search }) => search,
  loader: async ({ context, deps }) => {
    await context.queryClient.query({ ...membersOptions(deps), staleTime: "static" });
  }
});

function Page() {
  const search = Route.useSearch();

  const { data, error, isPending, refetch } = useQuery({
    ...membersOptions(search),
    placeholderData: keepPreviousData
  });

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Members</h1>
        <Muted className="mt-1">Every recorded member of the clan, pulled live from the roster.</Muted>
      </div>

      <MemberTable
        data={data}
        error={error}
        isLoading={isPending}
        onRetry={() => refetch()}
        search={search}
      />
    </div>
  );
}

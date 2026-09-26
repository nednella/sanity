import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { createFileRoute, getRouteApi } from "@tanstack/react-router";
import type { ReactNode } from "react";

import { PersonalBestTable } from "@/components/members/profile/submissions/personal-best-table";
import { SubmissionTable } from "@/components/members/profile/submissions/submission-table";
import { SubmissionTypeToggle } from "@/components/members/profile/submissions/submission-type-toggle";
import { memberPersonalBestsOptions, memberSubmissionsOptions } from "@/lib/api/queries/members";
import type { SubmissionsSearch } from "@/lib/members/submissions";
import { validateSubmissionsSearch } from "@/lib/members/submissions";

const ProfileBaseRoute = getRouteApi("/(site)/members/$memberId");

export const Route = createFileRoute("/(site)/members/$memberId/submissions")({
  component: Page,
  validateSearch: validateSubmissionsSearch,
  loaderDeps: ({ search }) => search,
  // Each table has its own response shape, so the two are fetched apart rather than through one union.
  loader: async ({ context, deps, params }) => {
    if (deps.type === "drops") {
      await context.queryClient.query({ ...memberSubmissionsOptions(params.memberId, deps), staleTime: "static" });
      return;
    }

    await context.queryClient.query({ ...memberPersonalBestsOptions(params.memberId, deps), staleTime: "static" });
  }
});

function Page() {
  const { memberId } = ProfileBaseRoute.useParams();
  const search = Route.useSearch();
  const navigate = Route.useNavigate();

  // The two tables sort on columns of their own, so switching tables drops the sort along with the page.
  const toolbar = (
    <SubmissionTypeToggle
      type={search.type}
      onChange={(type) => navigate({ replace: true, search: { limit: search.limit, offset: 0, type } })}
    />
  );

  return search.type === "drops" ? (
    <Drops
      memberId={memberId}
      search={search}
      toolbar={toolbar}
    />
  ) : (
    <PersonalBests
      memberId={memberId}
      search={search}
      toolbar={toolbar}
    />
  );
}

type TableProps = {
  memberId: string;
  search: SubmissionsSearch;
  toolbar: ReactNode;
};

function Drops({ memberId, search, toolbar }: Readonly<TableProps>) {
  const { data, error, isPending, refetch } = useQuery({
    ...memberSubmissionsOptions(memberId, search),
    placeholderData: keepPreviousData
  });

  return (
    <SubmissionTable
      data={data}
      error={error}
      isLoading={isPending}
      onRetry={() => refetch()}
      search={search}
      toolbar={toolbar}
    />
  );
}

function PersonalBests({ memberId, search, toolbar }: Readonly<TableProps>) {
  const { data, error, isPending, refetch } = useQuery({
    ...memberPersonalBestsOptions(memberId, search),
    placeholderData: keepPreviousData
  });

  return (
    <PersonalBestTable
      data={data}
      error={error}
      isLoading={isPending}
      onRetry={() => refetch()}
      search={search}
      toolbar={toolbar}
    />
  );
}

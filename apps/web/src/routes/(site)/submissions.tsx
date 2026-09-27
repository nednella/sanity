import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import type { ReactNode } from "react";

import { PersonalBestTable } from "@/components/submissions/personal-best-table";
import { SubmissionTable } from "@/components/submissions/submission-table";
import { SubmissionsToolbar } from "@/components/submissions/submissions-toolbar";
import { personalBestsOptions, submissionsOptions } from "@/lib/api/queries/submissions";
import type { SubmissionsSearch } from "@/lib/submissions/search";
import { validateSubmissionsSearch } from "@/lib/submissions/search";
import { Muted } from "@/lib/ui/typography/muted";

export const Route = createFileRoute("/(site)/submissions")({
  component: Page,
  validateSearch: validateSubmissionsSearch,
  loaderDeps: ({ search }) => search,
  loader: async ({ context, deps }) => {
    if (deps.type === "drops") {
      await context.queryClient.query({ ...submissionsOptions(deps), staleTime: "static" });
      return;
    }

    await context.queryClient.query({ ...personalBestsOptions(deps), staleTime: "static" });
  }
});

function Page() {
  const search = Route.useSearch();
  const navigate = Route.useNavigate();

  const toolbar = (
    <SubmissionsToolbar
      search={search}
      onChange={(next) => navigate({ replace: true, search: next })}
    />
  );

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Submissions</h1>
        <Muted className="mt-1">Every drop and personal best the clan has recorded.</Muted>
      </div>

      {search.type === "drops" ? (
        <Drops
          search={search}
          toolbar={toolbar}
        />
      ) : (
        <PersonalBests
          search={search}
          toolbar={toolbar}
        />
      )}
    </div>
  );
}

type TableProps = {
  search: SubmissionsSearch;
  toolbar: ReactNode;
};

function Drops({ search, toolbar }: Readonly<TableProps>) {
  const { data, error, isPending, refetch } = useQuery({
    ...submissionsOptions(search),
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

function PersonalBests({ search, toolbar }: Readonly<TableProps>) {
  const { data, error, isPending, refetch } = useQuery({
    ...personalBestsOptions(search),
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

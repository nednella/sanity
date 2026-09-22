import { Outlet, createFileRoute, notFound } from "@tanstack/react-router";

import { ErrorState } from "@/components/error-state";
import { ProfileHeader } from "@/components/members/profile/profile-header";
import { ProfileTabs } from "@/components/members/profile/profile-tabs";
import { NotFound } from "@/components/not-found";
import { memberProfileOptions } from "@/lib/api/queries/members";

export const Route = createFileRoute("/(site)/members/$memberId")({
  component: Layout,
  loader: async ({ context, params }) => {
    // A member id is a number, so anything else can't be a member.
    if (Number.isNaN(Number(params.memberId))) throw notFound();

    return context.queryClient.query({ ...memberProfileOptions(params.memberId), staleTime: "static" });
  },
  notFoundComponent: () => (
    <NotFound
      title="Member not found"
      description="This member doesn't exist, or the link is broken."
    />
  ),
  errorComponent: ({ error }) => (
    <ErrorState
      title="Couldn't load this member"
      error={error}
      tag="member-profile"
    />
  )
});

function Layout() {
  const { memberId } = Route.useParams();

  return (
    <div className="flex flex-col gap-8">
      <ProfileHeader profile={Route.useLoaderData()} />
      <div className="flex flex-col gap-8">
        <ProfileTabs memberId={memberId} />
        <Outlet />
      </div>
    </div>
  );
}

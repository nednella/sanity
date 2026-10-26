import { type QueryClient, useQuery } from "@tanstack/react-query";
import { Outlet, createFileRoute, notFound, redirect } from "@tanstack/react-router";

import { ErrorState } from "@/components/error-state";
import { ProfileHeader } from "@/components/members/profile/profile-header";
import { ProfileTabs } from "@/components/members/profile/profile-tabs";
import { NotFound } from "@/components/not-found";
import { memberProfileOptions } from "@/lib/api/queries/members";

async function loadProfile(queryClient: QueryClient, member: string) {
  try {
    return await queryClient.query({ ...memberProfileOptions(member), staleTime: "static" });
  } catch (error) {
    if ((error as { code?: string }).code === "MEMBER_NOT_FOUND") throw notFound();
    throw error;
  }
}

export const Route = createFileRoute("/(site)/members/$memberId")({
  component: Layout,
  loader: async ({ context, params }) => {
    const profile = await loadProfile(context.queryClient, params.memberId);

    // A profile is reached by name as well, but its id is the one address every tab links to.
    if (profile.id !== params.memberId) throw redirect({ to: ".", params: { memberId: profile.id }, replace: true });

    return profile;
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

  // The route loader fetches the initial data and populates it's own cache. Subscribing here is what lets
  // a mutation invalidate the profile query and have the page subscribe to the background refetch.
  // The route loader doesn't do that on it's own!
  const { data: profile } = useQuery({ ...memberProfileOptions(memberId), initialData: Route.useLoaderData() });

  return (
    <div className="flex flex-col gap-8">
      <ProfileHeader profile={profile} />
      <div className="flex flex-col gap-8">
        <ProfileTabs memberId={memberId} />
        <Outlet />
      </div>
    </div>
  );
}

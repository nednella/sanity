import { useQuery } from "@tanstack/react-query";
import { createFileRoute, getRouteApi } from "@tanstack/react-router";

import { ProfileSummaryBar } from "@/components/members/profile/profile-summary-bar";
import { memberProfileOptions } from "@/lib/api/queries/members";

const ProfileBaseRoute = getRouteApi("/(site)/members/$memberId");

export const Route = createFileRoute("/(site)/members/$memberId/")({
  component: Page
});

function Page() {
  const { memberId } = ProfileBaseRoute.useParams();

  const { data: profile } = useQuery({
    ...memberProfileOptions(memberId),
    initialData: ProfileBaseRoute.useLoaderData()
  });

  return (
    <div className="flex flex-col gap-8">
      <ProfileSummaryBar profile={profile} />
    </div>
  );
}

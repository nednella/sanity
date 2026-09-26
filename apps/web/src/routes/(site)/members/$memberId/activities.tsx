import { useQuery } from "@tanstack/react-query";
import { createFileRoute, getRouteApi } from "@tanstack/react-router";

import { ActivityTable } from "@/components/members/profile/wom/activity-table";
import { memberProfileOptions } from "@/lib/api/queries/members";
import { womEmptyMessage } from "@/lib/members/wom";

const ProfileBaseRoute = getRouteApi("/(site)/members/$memberId");

export const Route = createFileRoute("/(site)/members/$memberId/activities")({
  component: Page
});

function Page() {
  const { memberId } = ProfileBaseRoute.useParams();

  const { data: profile } = useQuery({
    ...memberProfileOptions(memberId),
    initialData: ProfileBaseRoute.useLoaderData()
  });

  return (
    <ActivityTable
      activities={profile.wom?.latestSnapshot?.activities}
      emptyMessage={womEmptyMessage(profile)}
    />
  );
}

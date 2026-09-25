import { useQuery } from "@tanstack/react-query";
import { createFileRoute, getRouteApi } from "@tanstack/react-router";

import { BossTable } from "@/components/members/profile/wom/boss-table";
import { memberProfileOptions } from "@/lib/api/queries/members";

const ProfileBaseRoute = getRouteApi("/(site)/members/$memberId");

export const Route = createFileRoute("/(site)/members/$memberId/bosses")({
  component: Page
});

function Page() {
  const { memberId } = ProfileBaseRoute.useParams();

  const { data: profile } = useQuery({
    ...memberProfileOptions(memberId),
    initialData: ProfileBaseRoute.useLoaderData()
  });

  return <BossTable snapshot={profile.wom?.latestSnapshot} />;
}

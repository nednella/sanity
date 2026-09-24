import { useQuery } from "@tanstack/react-query";
import { createFileRoute, getRouteApi } from "@tanstack/react-router";

import { RankProgressionPanel } from "@/components/members/profile/overview/rank-progression-panel";
import { WomSummaryPanel } from "@/components/members/profile/overview/wom-summary-panel";
import { ProfileSummaryBar } from "@/components/members/profile/profile-summary-bar";
import { Panel } from "@/components/panel";
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

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <Panel title="Account Summary">
          <WomSummaryPanel profile={profile} />
        </Panel>
        <Panel title="Rank Progression">
          <RankProgressionPanel profile={profile} />
        </Panel>
      </div>
    </div>
  );
}

import { useQuery } from "@tanstack/react-query";
import { createFileRoute, getRouteApi } from "@tanstack/react-router";

import { SkillTable } from "@/components/members/profile/wom/skill-table";
import { memberProfileOptions } from "@/lib/api/queries/members";

const ProfileBaseRoute = getRouteApi("/(site)/members/$memberId");

export const Route = createFileRoute("/(site)/members/$memberId/skills")({
  component: Page
});

function Page() {
  const { memberId } = ProfileBaseRoute.useParams();

  const { data: profile } = useQuery({
    ...memberProfileOptions(memberId),
    initialData: ProfileBaseRoute.useLoaderData()
  });

  return <SkillTable snapshot={profile.wom?.latestSnapshot} />;
}

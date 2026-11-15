import { Tab, Tabs } from "@/lib/ui/tabs";

type ProfileTabsProps = {
  memberId: string;
};

export function ProfileTabs({ memberId }: Readonly<ProfileTabsProps>) {
  return (
    <Tabs>
      <Tab
        activeOptions={{ exact: true, includeSearch: false }}
        params={{ memberId }}
        to="/members/$memberId"
      >
        Overview
      </Tab>
      <Tab
        params={{ memberId }}
        to="/members/$memberId/submissions"
      >
        Submissions
      </Tab>
      <Tab
        params={{ memberId }}
        to="/members/$memberId/skills"
      >
        Skills
      </Tab>
      <Tab
        params={{ memberId }}
        to="/members/$memberId/bosses"
      >
        Bosses
      </Tab>
      <Tab
        params={{ memberId }}
        to="/members/$memberId/activities"
      >
        Activities
      </Tab>
    </Tabs>
  );
}

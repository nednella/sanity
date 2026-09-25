import { Tab, Tabs } from "@/lib/ui/tabs";

type ProfileTabsProps = {
  memberId: string;
};

export function ProfileTabs({ memberId }: Readonly<ProfileTabsProps>) {
  return (
    <Tabs>
      <Tab
        to="/members/$memberId"
        params={{ memberId }}
        activeOptions={{ exact: true, includeSearch: false }}
      >
        Overview
      </Tab>
      <Tab
        to="/members/$memberId/skills"
        params={{ memberId }}
      >
        Skills
      </Tab>
    </Tabs>
  );
}

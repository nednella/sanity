import { Search } from "lucide-react";

import { Tab, Tabs } from "@/lib/ui/tabs";

type WikiTabsProps = {
  article: string;
};

export function WikiTabs({ article }: Readonly<WikiTabsProps>) {
  return (
    <Tabs
      actions={
        <label className="input -mb-px h-9 rounded-b-none border-base-300">
          <Search className="size-3.5 opacity-50" />
          <input
            aria-label="Search the Sanity wiki"
            placeholder="Search the Sanity wiki"
            type="search"
          />
        </label>
      }
    >
      <Tab
        activeOptions={{ exact: true }}
        params={{ article }}
        to="/wiki/$article"
      >
        Article
      </Tab>
      <Tab
        params={{ article }}
        to="/wiki/$article/discussion"
      >
        Discussion
      </Tab>
    </Tabs>
  );
}

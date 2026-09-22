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
            type="search"
            placeholder="Search the Sanity wiki"
            aria-label="Search the Sanity wiki"
          />
        </label>
      }
    >
      <Tab
        to="/wiki/$article"
        params={{ article }}
        activeOptions={{ exact: true }}
      >
        Article
      </Tab>
      <Tab
        to="/wiki/$article/discussion"
        params={{ article }}
      >
        Discussion
      </Tab>
    </Tabs>
  );
}

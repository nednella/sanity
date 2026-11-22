import { Search } from "lucide-react";

import { InputGroup, InputGroupAddon, InputGroupInput } from "@/lib/ui/input-group";
import { Tab, Tabs } from "@/lib/ui/tabs";

type WikiTabsProps = {
  article: string;
};

export function WikiTabs({ article }: Readonly<WikiTabsProps>) {
  return (
    <Tabs
      actions={
        <InputGroup
          className="
            -mb-px h-9 w-80 border-border bg-background
            dark:bg-background
          "
        >
          <InputGroupAddon>
            <Search className="size-3.5" />
          </InputGroupAddon>
          <InputGroupInput
            aria-label="Search the Sanity wiki"
            className="
              text-sm
              md:text-sm
            "
            placeholder="Search the Sanity wiki"
            type="search"
          />
        </InputGroup>
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

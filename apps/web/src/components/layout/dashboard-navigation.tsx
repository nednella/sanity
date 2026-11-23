import { Link, type LinkOptions } from "@tanstack/react-router";

import {
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  Sidebar as UISidebar
} from "@/lib/ui/sidebar";
import { Tab, Tabs } from "@/lib/ui/tabs";
import { H2 } from "@/lib/ui/typography/h2";
import { Overline } from "@/lib/ui/typography/overline";

type DashboardLink = LinkOptions & {
  title: string;
};

type DashboardSidebarProps = {
  links: readonly DashboardLink[];
  subtitle: string;
  title: string;
};

export function DashboardSidebar({ links, subtitle, title }: Readonly<DashboardSidebarProps>) {
  return (
    <UISidebar
      className="
        sticky top-0 hidden h-dvh border-x
        md:flex
      "
      collapsible="none"
    >
      <SidebarHeader className="p-4">
        <div className="px-2 py-1">
          <H2 className="font-black">{title}</H2>
          <Overline>{subtitle}</Overline>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2">
        <SidebarGroup>
          <SidebarMenu>
            {links.map((link) => (
              <DashboardSidebarLink
                key={link.title}
                link={link}
              />
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
    </UISidebar>
  );
}

type DashboardTabsProps = {
  links: readonly DashboardLink[];
};

export function DashboardTabs({ links }: Readonly<DashboardTabsProps>) {
  return (
    <div className="md:hidden">
      <Tabs>
        {links.map(({ title, ...options }) => (
          <Tab
            key={title}
            {...options}
          >
            {title}
          </Tab>
        ))}
      </Tabs>
    </div>
  );
}

type DashboardSidebarLinkProps = {
  link: DashboardLink;
};

function DashboardSidebarLink({ link }: Readonly<DashboardSidebarLinkProps>) {
  const { title, ...options } = link;

  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        className="text-sm"
        render={
          <Link
            {...options}
            activeOptions={{ includeSearch: false }}
            activeProps={{ "data-active": "" }}
          />
        }
      >
        {title}
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}

import { Link, linkOptions } from "@tanstack/react-router";
import { useState } from "react";

import { SANITY_DISCORD_URL } from "@sanity/urls";

import { ExternalLink } from "@/lib/ui/external-link";
import { DiscordLogo } from "@/lib/ui/logos";
import { Sheet, SheetContent, SheetTitle } from "@/lib/ui/sheet";
import {
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  Sidebar as UISidebar,
  useSidebar
} from "@/lib/ui/sidebar";
import { H2 } from "@/lib/ui/typography/h2";
import { Overline } from "@/lib/ui/typography/overline";

const wikiLinks = linkOptions([
  {
    to: "/wiki/$article",
    params: { article: "about" },
    title: "About"
  },
  {
    to: "/wiki/$article",
    params: { article: "ranks" },
    title: "Ranks"
  },
  {
    to: "/wiki/$article",
    params: { article: "requirements" },
    title: "Requirements"
  },
  {
    to: "/wiki/$article",
    params: { article: "diary" },
    title: "Achievement Diary"
  },
  {
    to: "/wiki/$article",
    params: { article: "faq" },
    title: "FAQ"
  }
]);

const clanLinks = linkOptions([
  {
    to: "/members",
    title: "Members"
  },
  {
    to: "/records",
    title: "Records"
  },
  {
    to: "/submissions",
    title: "Submissions"
  }
]);

const adminLinks = linkOptions([
  {
    to: "/admin",
    title: "Dashboard"
  }
]);

const navigationGroups = [
  {
    label: "Wiki",
    links: wikiLinks
  },
  {
    label: "Clan",
    links: clanLinks
  },
  {
    label: "Admin",
    links: adminLinks
  }
];

// A collapsed sidebar is a rail with the brand mark only. A click on the rail
// opens the full sidebar over the page, so the page keeps its width.
export function Sidebar() {
  const { isMobile, setOpenMobile, state } = useSidebar();
  const [isPeeking, setIsPeeking] = useState(false);
  const isRail = state === "collapsed" && !isMobile;

  if (!isRail && isPeeking) setIsPeeking(false);

  function closeOverlays() {
    setOpenMobile(false);
    setIsPeeking(false);
  }

  return (
    <>
      <UISidebar
        className="group-data-[side=left]:border-r-0"
        collapsible="icon"
      >
        {isRail ? (
          <button
            aria-label="Open the sidebar"
            className="
              flex h-full flex-col items-center
              hover:bg-sidebar-accent
            "
            onClick={() => setIsPeeking(true)}
            type="button"
          >
            <span className="pt-5 text-xl font-black">S</span>
          </button>
        ) : (
          <SidebarNavigation onNavigate={closeOverlays} />
        )}
      </UISidebar>

      <Sheet
        onOpenChange={setIsPeeking}
        open={isPeeking}
      >
        <SheetContent
          className="
            bg-sidebar p-0 text-sidebar-foreground
            data-[side=left]:w-64
          "
          showCloseButton={false}
          side="left"
        >
          <SheetTitle className="sr-only">Navigation</SheetTitle>
          <SidebarNavigation onNavigate={closeOverlays} />
        </SheetContent>
      </Sheet>
    </>
  );
}

type SidebarNavigationProps = {
  onNavigate: () => void;
};

function SidebarNavigation({ onNavigate }: Readonly<SidebarNavigationProps>) {
  return (
    <>
      <SidebarHeader className="gap-4 p-4">
        <Link
          className="block px-2 py-1"
          onClick={onNavigate}
          to="/"
        >
          <H2 className="font-black">Sanity</H2>
          <Overline>The Sanity Wiki</Overline>
        </Link>
        <DiscordButton />
      </SidebarHeader>

      <SidebarContent className="px-2">
        {navigationGroups.map((group) => (
          <SidebarGroup key={group.label}>
            <SidebarGroupLabel className="font-semibold tracking-wide uppercase">{group.label}</SidebarGroupLabel>
            <SidebarMenu>
              {group.links.map((link) => (
                <NavigationLink
                  key={link.title}
                  link={link}
                  onNavigate={onNavigate}
                />
              ))}
            </SidebarMenu>
          </SidebarGroup>
        ))}
      </SidebarContent>
    </>
  );
}

type NavigationLinkProps = {
  link: (typeof adminLinks)[number] | (typeof clanLinks)[number] | (typeof wikiLinks)[number];
  onNavigate: () => void;
};

function NavigationLink({ link, onNavigate }: Readonly<NavigationLinkProps>) {
  const { title, ...options } = link;

  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        className="text-sm"
        render={
          <Link
            {...options}
            activeOptions={{
              exact: true,
              includeSearch: false
            }}
            activeProps={{ "data-active": "" }}
            onClick={onNavigate}
          />
        }
      >
        {title}
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}

function DiscordButton() {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          className="
            h-9 justify-center bg-primary text-sm font-medium text-primary-foreground
            hover:bg-primary/80 hover:text-primary-foreground
            active:bg-primary/80 active:text-primary-foreground
          "
          render={<ExternalLink href={SANITY_DISCORD_URL} />}
        >
          <DiscordLogo className="fill-current" />
          Chat on Discord
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

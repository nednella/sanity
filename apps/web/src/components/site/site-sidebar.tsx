import { Link, linkOptions } from "@tanstack/react-router";

import { DiscordLogo } from "@/components/logos/discord-logo.js";
import { ExternalLink } from "@/components/navigation/external-link.js";
import { DISCORD_URL } from "@/lib/links.js";
import { Button } from "@/lib/ui/button.js";

const wikiLinks = linkOptions([
  {
    to: "/wiki/about",
    title: "About"
  },
  {
    to: "/wiki/ranks",
    title: "Ranks"
  },
  {
    to: "/wiki/requirements",
    title: "Requirements"
  },
  {
    to: "/wiki/diary",
    title: "Achievement Diary"
  },
  {
    to: "/wiki/faq",
    title: "FAQ"
  }
]);

const clanLinks = linkOptions([
  {
    to: "/members",
    title: "Members"
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
  }
];

export function SiteSidebar() {
  return (
    <div className="flex min-h-full w-60 flex-col gap-4 bg-base-100 p-4 lg:sticky lg:top-0 lg:h-screen lg:overflow-y-auto">
      <Link
        to="/"
        className="block px-2 py-1"
      >
        <span className="block text-xl font-black tracking-tight">Sanity</span>
        <span className="block text-[0.65rem] font-medium tracking-widest text-base-content/50 uppercase">
          The Sanity Wiki
        </span>
      </Link>

      <Button
        asChild
        className="w-full"
      >
        <ExternalLink href={DISCORD_URL}>
          <DiscordLogo className="size-4 fill-current" />
          Chat on Discord
        </ExternalLink>
      </Button>

      <nav className="flex flex-col gap-5">
        {navigationGroups.map((group) => (
          <div key={group.label}>
            <h2 className="mb-1 px-2 text-sm font-semibold tracking-wide text-base-content/50 uppercase">
              {group.label}
            </h2>
            <ul className="menu w-full p-0 text-[0.95rem]">
              {group.links.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    activeProps={{ className: "menu-active" }}
                    activeOptions={{
                      exact: true,
                      includeSearch: false
                    }}
                  >
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>
    </div>
  );
}

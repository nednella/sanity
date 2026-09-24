import { Link, linkOptions } from "@tanstack/react-router";

import { Button } from "@/lib/ui/button";
import { ExternalLink } from "@/lib/ui/external-link";
import { DiscordLogo } from "@/lib/ui/logos";
import { H2 } from "@/lib/ui/typography/h2";
import { H4 } from "@/lib/ui/typography/h4";
import { Overline } from "@/lib/ui/typography/overline";
import { SANITY_DISCORD_URL } from "@/utils/links";

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

export function Sidebar() {
  return (
    <div className="flex min-h-full w-60 flex-col gap-4 bg-base-100 p-4 lg:sticky lg:top-0 lg:h-screen lg:overflow-y-auto">
      <Link
        to="/"
        className="block px-2 py-1"
      >
        <H2 className="font-black">Sanity</H2>
        <Overline>The Sanity Wiki</Overline>
      </Link>

      <Button
        asChild
        className="w-full"
      >
        <ExternalLink href={SANITY_DISCORD_URL}>
          <DiscordLogo className="size-4 fill-current" />
          Chat on Discord
        </ExternalLink>
      </Button>

      <nav className="flex flex-col gap-5">
        {navigationGroups.map((group) => (
          <div key={group.label}>
            <H4 className="mb-1 px-2">{group.label}</H4>
            <ul className="menu w-full p-0 text-[0.95rem]">
              {group.links.map(({ title, ...link }) => (
                <li key={title}>
                  <Link
                    {...link}
                    activeProps={{ className: "menu-active" }}
                    activeOptions={{
                      exact: true,
                      includeSearch: false
                    }}
                  >
                    {title}
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

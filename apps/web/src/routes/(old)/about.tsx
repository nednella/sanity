import { Link, createFileRoute, linkOptions } from "@tanstack/react-router";
import { BookOpen, CalendarDays, Crown, HandCoins, Medal, Timer } from "lucide-react";

import { CallToAction } from "@/components/landing/call-to-action.js";
import { Hero } from "@/components/landing/hero.js";
import { TextWithImage } from "@/components/landing/text-with-image.js";
import { Container } from "@/components/layout/container.js";
import { ItemGrid } from "@/components/layout/item-grid.js";
import { Section } from "@/components/layout/section.js";
import { NavbarSpacer } from "@/components/navigation/navbar-spacer.js";
import { Card } from "@/lib/ui/card.js";
import { H3 } from "@/lib/ui/typography/h3.js";
import { Large } from "@/lib/ui/typography/large.js";
import { Muted } from "@/lib/ui/typography/muted.js";
import { P } from "@/lib/ui/typography/p.js";

export const Route = createFileRoute("/(old)/about")({
  component: AboutPage
});

type Stat = {
  label: string;
  value: string;
};

const about: Stat[] = [
  { label: "Established", value: "2015" },
  { label: "Active Members", value: "300+" },
  { label: "Home World", value: "364" },
  { label: "Clan Chat", value: "Sanity" }
];

const community: Stat[] = [
  { label: "World Records", value: "15+" },
  { label: "Max Capes", value: "190+" },
  { label: "Total Clan EHB", value: "550k+" },
  { label: "Total Loot Value", value: "1.4t+" }
];

type Official = {
  avatarSrc: string;
  roleSrc: string;
  name: string;
  role: string;
};

// TODO: images
const officials: Official[] = [
  {
    avatarSrc: "",
    roleSrc: "",
    name: "Boxedup",
    role: "Owner"
  },
  {
    avatarSrc: "",
    roleSrc: "",
    name: "Sabfas",
    role: "Council"
  },
  {
    avatarSrc: "",
    roleSrc: "",
    name: "Sleep",
    role: "Council"
  },
  {
    avatarSrc: "",
    roleSrc: "",
    name: "Picuu",
    role: "Council"
  },
  {
    avatarSrc: "",
    roleSrc: "",
    name: "Council Member 5",
    role: "Council"
  },
  {
    avatarSrc: "",
    roleSrc: "",
    name: "Council Member 6",
    role: "Council"
  }
];

const highlights = linkOptions([
  {
    to: "/diary",
    icon: BookOpen,
    title: "Achievement Diary",
    description: "compare your speedrunning times against our tracked content and work towards diary completionist"
  },
  {
    to: "/",
    icon: Timer,
    title: "Personal Bests",
    description: "submit your fastest completion times for tracked content and compare against our clan leaderboards"
  },
  {
    to: "/",
    icon: HandCoins,
    title: "Loot Tracking",
    description: "submit your loot to gain membership points and progress through the ranks"
  },
  {
    to: "/",
    icon: Crown,
    title: "Clan Rankings",
    description: "climb through the ranks from Member to Master by engaging with the community and gaining clan points"
  },
  {
    to: "/",
    icon: Medal,
    title: "Member Leaderboards",
    description: "view detailed stats, compare achievements, and track your progression against the best"
  },
  {
    to: "/",
    icon: CalendarDays,
    title: "Community Events",
    description: "participate in regular clan competitions, group raids, and special challenges"
  }
]);

function AboutPage() {
  return (
    <>
      <NavbarSpacer />
      <Hero
        title="Clan Background"
        description="learn more about who we are"
        className="pt-36 pb-24"
        reduceMotion
      />

      {/* about */}
      <Section className="pb-24">
        <Container>
          {/* TODO: images */}
          <TextWithImage
            title="About us"
            imageSrc=""
            imageAlt=""
          >
            <P>
              Founded in 2015 by Castiyel and Adam R Pro, Sanity is an ex-warring clan turned PvM with an active and
              tight-knit community within Old School RuneScape.
            </P>
            <ItemGrid
              cols="grid-cols-2 sm:grid-cols-4"
              className="mt-6"
            >
              {about.map((item) => (
                <Card key={item.label}>
                  <H3 className="mb-1 text-xl">{item.value}</H3>
                  <Muted className="mt-auto">{item.label}</Muted>
                </Card>
              ))}
            </ItemGrid>
          </TextWithImage>
        </Container>
      </Section>

      {/* community */}
      <Section className="pb-24">
        <Container>
          {/* TODO: images */}
          <TextWithImage
            title="Our community"
            imageSrc=""
            imageAlt=""
            flipContent
          >
            <P>
              We host a diverse group of exceptional players, ranging from speedrunners to pet hunters and
              completionists.
            </P>
            <ItemGrid
              cols="grid-cols-2 sm:grid-cols-4"
              className="mt-6"
            >
              {community.map((item) => (
                <Card key={item.label}>
                  <H3 className="mb-1 text-xl">{item.value}</H3>
                  <Muted className="mt-auto">{item.label}</Muted>
                </Card>
              ))}
            </ItemGrid>
          </TextWithImage>
        </Container>
      </Section>

      {/* council */}
      <Section className="pb-24">
        <Container>
          <H3 className="mb-6">Clan officials</H3>
          <ItemGrid
            cols="sm:grid-cols-2 lg:grid-cols-3"
            className="lg:gap-6"
          >
            {officials.map((item) => (
              <Card
                key={item.name}
                className="p-0 transition-all hover:border-base-content/20 hover:shadow-md"
              >
                {/* TODO: link to member profile */}
                <Link
                  to="/"
                  className="flex flex-col items-center p-4 text-center lg:p-6"
                >
                  {/* TODO: avatar image */}
                  <div className="mb-4 size-20 rounded-full bg-base-200" />
                  <div className="mb-1 flex items-center gap-2">
                    <H3 className="text-lg">{item.name}</H3>
                    {/* TODO: clan rank sprite */}
                    <div className="size-8 rounded-full bg-base-200" />
                  </div>
                  <Muted className="text-sm">{item.role}</Muted>
                </Link>
              </Card>
            ))}
          </ItemGrid>
        </Container>
      </Section>

      {/* highlights */}
      <Section className="pb-48">
        <Container>
          <H3 className="mb-6">Clan highlights</H3>
          <ItemGrid
            cols="sm:grid-cols-2 lg:grid-cols-3"
            className="lg:gap-6"
          >
            {highlights.map((item) => (
              <Card
                key={item.title}
                className="group p-0 transition-all hover:border-base-content/20 hover:shadow-md"
              >
                <Link
                  to={item.to}
                  className="flex flex-col items-center p-4 text-center lg:p-6"
                >
                  <div className="mb-4 inline-flex self-center rounded-xl border bg-base-200 p-3 transition-colors hover:bg-base-300">
                    <item.icon className="size-5 text-base-content transition-transform group-hover:scale-110" />
                  </div>
                  <Large className="mb-2">{item.title}</Large>
                  <Muted className="mb-4">{item.description}</Muted>
                </Link>
              </Card>
            ))}
          </ItemGrid>
        </Container>
      </Section>

      <CallToAction />
    </>
  );
}

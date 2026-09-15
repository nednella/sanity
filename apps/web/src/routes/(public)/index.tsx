import { Link, createFileRoute } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";

import { BackgroundContent } from "@/components/landing/background-content.js";
import { Hero } from "@/components/landing/hero.js";
import { DiscordLogo } from "@/components/logos/discord-logo.js";
import { Button } from "@/lib/ui/button.js";

export const Route = createFileRoute("/(public)/")({
  component: IndexPage
});

function IndexPage() {
  return (
    <>
      <BackgroundContent />
      <Hero
        title="Welcome to Sanity"
        description="an elite Old School RuneScape PvM clan home to some of the best players in the game"
        className="relative flex min-h-screen items-center justify-center overflow-hidden"
        isOverMedia
      >
        <Button
          asChild
          size="lg"
          className="group w-full max-w-xs rounded-full px-8! transition-all sm:w-auto"
        >
          <a
            href="https://discord.gg/sanity"
            target="_blank"
            rel="noopener noreferrer"
          >
            <DiscordLogo className="mr-2 size-4 fill-primary-content" />
            <span>Join our Discord</span>
            <ArrowRight className="ml-2 size-4 transition-transform group-hover:translate-x-1" />
          </a>
        </Button>
        <Button
          asChild
          size="lg"
          variant="outline"
          className="w-full max-w-xs rounded-full px-8 transition-all sm:w-auto"
        >
          <Link to="/about">Learn More</Link>
        </Button>
      </Hero>
    </>
  );
}

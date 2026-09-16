import { Link, createFileRoute } from "@tanstack/react-router";

import { BackgroundContent } from "@/components/landing/background-content.js";
import { Hero } from "@/components/landing/hero.js";
import { DiscordLogo } from "@/components/logos/discord-logo.js";
import { ExternalLink } from "@/components/navigation/external-link.js";
import { ThemeToggle } from "@/components/theme/theme-toggle.js";
import { DISCORD_URL } from "@/lib/links.js";
import { Button } from "@/lib/ui/button.js";
import { cn } from "@/lib/ui/utils.js";

export const Route = createFileRoute("/")({
  component: IndexPage
});

const floatingButton = "rounded-none border-white/20 bg-black/40 text-white backdrop-blur-sm hover:bg-black/60";

function IndexPage() {
  return (
    <>
      <BackgroundContent />
      <div className="fixed top-4 right-4 z-10 flex gap-2">
        <Button
          asChild
          size="icon"
          variant="ghost"
          className={floatingButton}
        >
          <ExternalLink
            href={DISCORD_URL}
            aria-label="Join our Discord"
          >
            <DiscordLogo className="size-4 fill-current" />
          </ExternalLink>
        </Button>
        <ThemeToggle className={floatingButton} />
        <Button
          asChild
          size="lg"
          variant="outline"
          className={floatingButton}
        >
          <Link to="/login">
            <span>Log in</span>
          </Link>
        </Button>
      </div>
      <Hero
        title="Welcome to Sanity"
        description="an elite Old School RuneScape PvM clan home to some of the best players in the game"
        className="relative flex min-h-screen items-center justify-center overflow-hidden"
        isOverMedia
      >
        <Button
          asChild
          size="lg"
          variant="outline"
          className={cn("w-full max-w-48", floatingButton)}
        >
          <Link to="/wiki">
            <span>Enter</span>
          </Link>
        </Button>
      </Hero>
    </>
  );
}

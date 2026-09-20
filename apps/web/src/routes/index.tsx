import { Link, createFileRoute } from "@tanstack/react-router";

import { BackgroundContent } from "@/components/landing/background-content";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { Button } from "@/lib/ui/button";
import { ExternalLink } from "@/lib/ui/external-link";
import { Hero } from "@/lib/ui/hero";
import { DiscordLogo } from "@/lib/ui/logos";
import { cn } from "@/lib/ui/utils";
import { SANITY_DISCORD_URL } from "@/utils/links";

export const Route = createFileRoute("/")({
  component: Page
});

const floatingButton = "rounded-none border-white/20 bg-black/40 text-white backdrop-blur-sm hover:bg-black/60";

function Page() {
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
            href={SANITY_DISCORD_URL}
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
        overlay
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

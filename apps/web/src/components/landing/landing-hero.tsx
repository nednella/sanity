import { Link } from "@tanstack/react-router";
import { cn } from "cn";

import { config } from "@config";

import { Badge } from "@/lib/ui/badge";
import { Button } from "@/lib/ui/button";
import { Hero } from "@/lib/ui/hero";

const buttonStyle = "rounded-none border-white/20 bg-black/40 text-white backdrop-blur-sm hover:bg-black/60";

export function LandingHero() {
  return (
    <Hero
      className="relative flex min-h-screen items-start justify-center overflow-hidden pt-[12vh]"
      description="an elite Old School RuneScape PvM clan home to some of the best players in the game"
      overlay
      title="Welcome to Sanity"
    >
      {config.isProduction ? (
        <Badge
          className={cn("badge-lg", buttonStyle)}
          variant="outline"
        >
          Coming soon
        </Badge>
      ) : (
        <Button
          asChild
          className={cn("w-full max-w-48", buttonStyle)}
          size="lg"
          variant="outline"
        >
          <Link to="/wiki">
            <span>Enter</span>
          </Link>
        </Button>
      )}
    </Hero>
  );
}

import { Link } from "@tanstack/react-router";
import { cn } from "cn";

import { config } from "@config";

import { Badge } from "@/lib/ui/badge";
import { Button } from "@/lib/ui/button";
import { Hero } from "@/lib/ui/hero";

const buttonStyle = `
  border-white/20 bg-black/40 text-sm text-white backdrop-blur-sm
  hover:bg-black/60
  dark:border-white/20 dark:bg-black/40
  dark:hover:bg-black/60
`;

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
          className={cn("h-7 px-3", buttonStyle)}
          variant="outline"
        >
          Coming soon
        </Badge>
      ) : (
        <Button
          className={cn("h-10 w-full max-w-48 px-6", buttonStyle)}
          nativeButton={false}
          render={<Link to="/wiki" />}
          size="lg"
          variant="outline"
        >
          <span>Enter</span>
        </Button>
      )}
    </Hero>
  );
}

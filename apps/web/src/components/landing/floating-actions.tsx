import { Link } from "@tanstack/react-router";

import { SANITY_DISCORD_URL, SANITY_X_URL } from "@sanity/urls";

import { config } from "@config";

import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/lib/ui/button";
import { ExternalLink } from "@/lib/ui/external-link";
import { DiscordLogo, TwitterLogo } from "@/lib/ui/logos";

const buttonStyle = "rounded-none border-white/20 bg-black/40 text-white backdrop-blur-sm hover:bg-black/60";

export function FloatingActions() {
  return (
    <div className="fixed top-4 right-4 z-10 flex gap-2">
      <Button
        asChild
        className={buttonStyle}
        size="icon"
        variant="ghost"
      >
        <ExternalLink
          aria-label="Join our Discord"
          href={SANITY_DISCORD_URL}
        >
          <DiscordLogo className="size-4 fill-current" />
        </ExternalLink>
      </Button>
      <Button
        asChild
        className={buttonStyle}
        size="icon"
        variant="ghost"
      >
        <ExternalLink
          aria-label="Follow us on X"
          href={SANITY_X_URL}
        >
          <TwitterLogo className="size-4 fill-current" />
        </ExternalLink>
      </Button>
      <ThemeToggle className={buttonStyle} />
      {!config.isProduction && (
        <Button
          asChild
          className={buttonStyle}
          size="lg"
          variant="outline"
        >
          <Link to="/login">
            <span>Log in</span>
          </Link>
        </Button>
      )}
    </div>
  );
}

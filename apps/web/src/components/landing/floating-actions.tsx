import { cn } from "cn";

import { SANITY_DISCORD_URL, SANITY_X_URL } from "@sanity/urls";

import { config } from "@config";

import { AccountMenu } from "@/components/account-menu";
import { ThemeToggle } from "@/components/theme-toggle";
import { useLoginDialog } from "@/lib/login/use-login-dialog";
import { Button } from "@/lib/ui/button";
import { ExternalLink } from "@/lib/ui/external-link";
import { DiscordLogo, TwitterLogo } from "@/lib/ui/logos";

const buttonStyle = `
  border-white/20 bg-black/40 text-sm text-white backdrop-blur-sm
  hover:bg-black/60
  dark:border-white/20 dark:bg-black/40
  dark:hover:bg-black/60
`;

export function FloatingActions() {
  const { open } = useLoginDialog();

  return (
    <div className="fixed top-4 right-4 z-10 flex gap-2">
      <Button
        className={cn("size-10", buttonStyle)}
        nativeButton={false}
        render={
          <ExternalLink
            aria-label="Join our Discord"
            href={SANITY_DISCORD_URL}
          />
        }
        size="icon"
        variant="ghost"
      >
        <DiscordLogo className="size-4 fill-current" />
      </Button>
      <Button
        className={cn("size-10", buttonStyle)}
        nativeButton={false}
        render={
          <ExternalLink
            aria-label="Follow us on X"
            href={SANITY_X_URL}
          />
        }
        size="icon"
        variant="ghost"
      >
        <TwitterLogo className="size-4 fill-current" />
      </Button>
      <ThemeToggle className={cn("size-10", buttonStyle)} />
      {!config.isProduction && (
        <AccountMenu triggerClassName={cn("rounded-none", buttonStyle)}>
          <Button
            className={cn("h-10 px-6", buttonStyle)}
            onClick={open}
            size="lg"
            variant="outline"
          >
            Log in
          </Button>
        </AccountMenu>
      )}
    </div>
  );
}

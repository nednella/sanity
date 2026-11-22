import { useEffect, useRef } from "react";

import { SANITY_DISCORD_URL } from "@sanity/urls";

import { config } from "@config";

import { useLoginDialog } from "@/lib/login/use-login-dialog";
import { Button } from "@/lib/ui/button";
import { Dialog, type DialogHandle } from "@/lib/ui/dialog";
import { ExternalLink } from "@/lib/ui/external-link";
import { DiscordLogo } from "@/lib/ui/logos";

export function LoginDialog() {
  const { close, login } = useLoginDialog();
  const dialog = useRef<DialogHandle>(null);
  const loginUrl = `${config.apiUrl}/v1/auth/discord`;

  useEffect(() => {
    if (login === undefined) dialog.current?.close();
    else dialog.current?.open();
  }, [login]);

  function handleClose() {
    if (login !== undefined) close();
  }

  return (
    <Dialog
      aside={<LoginArt />}
      className="
        max-w-2xl
        sm:grid-cols-2
      "
      onClose={handleClose}
      ref={dialog}
      title="Welcome to Sanity"
    >
      <div className="flex h-full flex-col gap-6">
        <p className="text-sm text-base-content/60">
          Log in with the Discord account that&apos;s linked to our platform.
        </p>
        <div className="flex flex-col gap-2">
          <Button
            asChild
            className="
              w-full border-none bg-[#5865F2] text-white
              hover:bg-[#4752C4]
            "
            variant="custom"
          >
            <a href={loginUrl}>
              <DiscordLogo className="size-4 fill-current" />
              Continue with Discord
            </a>
          </Button>
          <ExternalLink
            className="
              mt-1 self-center text-xs
              hover:underline
            "
            href={SANITY_DISCORD_URL}
          >
            Not a member? Join our Discord to apply
          </ExternalLink>
        </div>
      </div>
    </Dialog>
  );
}

function LoginArt() {
  return (
    <div
      className="
        relative h-28 bg-[url(/bg/fishing-v1.jpg)] bg-cover bg-center
        sm:h-auto sm:min-h-64
      "
    >
      <div className="absolute inset-0 bg-linear-to-b from-transparent to-black/80" />
      <div className="absolute bottom-4 left-4 text-white">
        <p className="text-xs tracking-widest uppercase opacity-80">Old School RuneScape clan</p>
        <p className="text-2xl font-semibold">Sanity</p>
      </div>
    </div>
  );
}

import { rootRouteId, useNavigate, useSearch } from "@tanstack/react-router";
import { useEffect, useRef } from "react";

import { SANITY_DISCORD_URL } from "@sanity/urls";

import { config } from "@config";

import { Button } from "@/lib/ui/button";
import { Dialog, type DialogHandle } from "@/lib/ui/dialog";
import { ExternalLink } from "@/lib/ui/external-link";
import { DiscordLogo } from "@/lib/ui/logos";

const errors = {
  failed: "The Discord sign-in did not finish. Try again.",
  "not-a-member": "That Discord account is not a Sanity member."
};

export function SignInDialog() {
  const { signIn } = useSearch({ from: rootRouteId });
  const navigate = useNavigate();
  const dialog = useRef<DialogHandle>(null);
  const error = signIn === "failed" || signIn === "not-a-member" ? signIn : undefined;

  useEffect(() => {
    if (signIn === undefined) dialog.current?.close();
    else dialog.current?.open();
  }, [signIn]);

  function handleClose() {
    void navigate({
      search: (previous) => ({
        ...previous,
        signIn: undefined
      }),
      to: "."
    });
  }

  return (
    <Dialog
      className="max-w-sm"
      onClose={handleClose}
      ref={dialog}
      title="Log in to Sanity"
    >
      <div className="flex flex-col gap-4">
        <p className="text-sm text-base-content/60">Clan members sign in with their Discord account.</p>
        {error && (
          <div
            className="alert alert-soft text-sm alert-error"
            role="alert"
          >
            {errors[error]}
          </div>
        )}
        <Button
          asChild
          className="w-full"
        >
          <a href={`${config.apiUrl}/v1/auth/discord`}>
            <DiscordLogo className="size-4 fill-current" />
            Sign in with Discord
          </a>
        </Button>
        {error === "not-a-member" && (
          <ExternalLink
            className="link text-center text-sm"
            href={SANITY_DISCORD_URL}
          >
            Join the clan Discord to apply
          </ExternalLink>
        )}
      </div>
    </Dialog>
  );
}

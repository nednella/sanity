import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import type { MouseEvent } from "react";
import { toast } from "sonner";

import { api } from "@/lib/api/client";
import { signedInMemberOptions } from "@/lib/api/queries/members";
import { Avatar } from "@/lib/ui/avatar";
import { Button } from "@/lib/ui/button";
import { Dropdown } from "@/lib/ui/dropdown";
import { closeDropdown } from "@/lib/ui/utils";

export function AccountMenu() {
  const queryClient = useQueryClient();
  const { data: member, isPending } = useQuery(signedInMemberOptions());

  const signOut = api.useMutation("post", "/v1/auth/logout", {
    onSuccess: () => queryClient.resetQueries({ queryKey: signedInMemberOptions().queryKey }),
    onError: () => toast.error("Couldn't sign out")
  });

  function handleSignOut(event: MouseEvent<HTMLElement>) {
    closeDropdown(event);
    signOut.mutate({});
  }

  if (isPending) return null;

  if (!member) {
    return (
      <Button
        asChild
        size="sm"
        variant="ghost"
      >
        <Link
          search={(previous) => ({
            ...previous,
            signIn: "open"
          })}
          to="."
        >
          Log in
        </Link>
      </Button>
    );
  }

  return (
    <Dropdown
      align="end"
      label={
        <Avatar
          size="sm"
          src={member.discord.avatarUrl}
        />
      }
      triggerClassName="btn-circle btn-ghost"
    >
      <li className="menu-title">{member.displayName}</li>
      <li>
        <Link
          onClick={closeDropdown}
          params={{ memberId: member.id }}
          to="/members/$memberId"
        >
          Profile
        </Link>
      </li>
      <li>
        <Link
          onClick={closeDropdown}
          params={{ memberId: member.id }}
          to="/members/$memberId/submissions"
        >
          My submissions
        </Link>
      </li>
      <li>
        <button
          disabled={signOut.isPending}
          onClick={handleSignOut}
          type="button"
        >
          Sign out
        </button>
      </li>
    </Dropdown>
  );
}

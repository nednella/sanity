import { Link } from "@tanstack/react-router";
import { cn } from "cn";
import type { MouseEvent, ReactNode } from "react";

import { useAuth } from "@/lib/auth/use-auth";
import { Avatar } from "@/lib/ui/avatar";
import { Dropdown } from "@/lib/ui/dropdown";
import { closeDropdown } from "@/lib/ui/utils";

type AccountMenuProps = {
  // Shown instead of the menu when no member is logged in.
  children: ReactNode;
  triggerClassName?: string;
};

export function AccountMenu({ children, triggerClassName }: Readonly<AccountMenuProps>) {
  const { logout, member, isLoading } = useAuth();

  function handleLogout(event: MouseEvent<HTMLElement>) {
    closeDropdown(event);
    logout();
  }

  if (isLoading) return null;
  if (member === undefined) return children;

  return (
    <Dropdown
      align="end"
      label={
        <>
          <Avatar
            size="sm"
            src={member.discord.avatarUrl}
          />
          <span className="sr-only">Account menu</span>
        </>
      }
      triggerClassName={cn("btn-square btn-ghost size-10", triggerClassName)}
    >
      <li>
        <Link
          onClick={closeDropdown}
          params={{ memberId: member.id }}
          to="/members/$memberId"
        >
          Profile
        </Link>
      </li>
      <li />
      <li>
        <button
          onClick={handleLogout}
          type="button"
        >
          Log out
        </button>
      </li>
    </Dropdown>
  );
}

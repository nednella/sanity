import { Link } from "@tanstack/react-router";
import { cn } from "cn";
import { LogOut, UserRound } from "lucide-react";
import type { ReactNode } from "react";

import { useAuth } from "@/lib/auth/use-auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/lib/ui/avatar";
import { Button } from "@/lib/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/lib/ui/dropdown-menu";

type AccountMenuProps = {
  // Shown instead of the menu when no member is logged in.
  children: ReactNode;
  triggerClassName?: string;
};

export function AccountMenu({ children, triggerClassName }: Readonly<AccountMenuProps>) {
  const { logout, member, isLoading } = useAuth();

  if (isLoading) return null;
  if (member === undefined) return children;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            className={cn("size-10 rounded-full", triggerClassName)}
            size="icon"
            variant="ghost"
          />
        }
      >
        <MemberAvatar url={member.discord.avatarUrl} />
        <span className="sr-only">Account menu</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-56"
      >
        <DropdownMenuGroup>
          <DropdownMenuLabel className="flex items-center gap-2 text-foreground">
            <MemberAvatar url={member.discord.avatarUrl} />
            <span className="grid leading-tight">
              <span className="truncate font-medium">{member.displayName}</span>
              {member.rsn.main && <span className="truncate text-muted-foreground">{member.rsn.main}</span>}
            </span>
          </DropdownMenuLabel>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          render={
            <Link
              params={{ memberId: member.id }}
              to="/members/$memberId"
            />
          }
        >
          <UserRound />
          Profile
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={logout}>
          <LogOut />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function MemberAvatar({ url }: Readonly<{ url: string | null }>) {
  return (
    <Avatar>
      {url && <AvatarImage src={url} />}
      <AvatarFallback>
        <UserRound className="size-4" />
      </AvatarFallback>
    </Avatar>
  );
}

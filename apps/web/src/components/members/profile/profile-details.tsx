import { ChevronDown } from "lucide-react";
import { Fragment, type ReactNode } from "react";

import type { MemberProfile } from "@sanity/api";
import { formatDate, formatRsn } from "@sanity/utils";

import { Button } from "@/lib/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger
} from "@/lib/ui/dropdown-menu";
import { RelativeDate } from "@/lib/ui/relative-date";
import { Muted } from "@/lib/ui/typography/muted";

const SHOWN = 10;

type ProfileDetailsProps = {
  profile: MemberProfile;
};

export function ProfileDetails({ profile }: Readonly<ProfileDetailsProps>) {
  const { membership, rsn, wom } = profile;

  const details: { content: ReactNode; key: string }[] = [
    { content: <PreviousNames rsn={rsn} />, key: "rsn" },
    { content: `Joined ${formatDate(membership.joinedAt)}`, key: "joined" },
    ...(wom
      ? [
          {
            content: (
              <>
                Last sync <RelativeDate value={wom.syncedAt} />
              </>
            ),
            key: "sync"
          }
        ]
      : [])
  ].filter((detail) => detail.content);

  return (
    <Muted className="flex flex-wrap items-center gap-x-2 gap-y-1">
      {details.map(({ content, key }, index) => (
        <Fragment key={key}>
          {index > 0 && <span aria-hidden="true">·</span>}
          <span>{content}</span>
        </Fragment>
      ))}
    </Muted>
  );
}

type PreviousNamesProps = {
  rsn: MemberProfile["rsn"];
};

function PreviousNames({ rsn }: Readonly<PreviousNamesProps>) {
  const name = formatRsn(rsn);
  if (rsn.previous.length === 0) return name;

  const shown = rsn.previous.slice(0, SHOWN);
  const remaining = rsn.previous.length - shown.length;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            className="h-auto px-1 py-0 text-sm font-normal text-muted-foreground"
            size="sm"
            variant="ghost"
          />
        }
      >
        {name}
        <ChevronDown className="size-3" />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64">
        <DropdownMenuGroup>
          <DropdownMenuLabel>Previously</DropdownMenuLabel>
          {shown.map(({ name: previous, until }) => (
            <DropdownMenuItem
              className="justify-between gap-4"
              key={previous}
            >
              {previous}
              <span className="text-muted-foreground">{formatDate(until)}</span>
            </DropdownMenuItem>
          ))}
          {remaining > 0 && <DropdownMenuLabel>and {remaining} more</DropdownMenuLabel>}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

import { ChevronDown } from "lucide-react";
import { Fragment } from "react";
import type { ReactNode } from "react";

import type { MemberProfile } from "@/lib/api/types";
import { Dropdown } from "@/lib/ui/dropdown";
import { RelativeDate } from "@/lib/ui/relative-date";
import { Muted } from "@/lib/ui/typography/muted";
import { formatDate } from "@/utils/dates";

const SHOWN = 10;

const formatRsn = ({ main, alt }: { main: string | null; alt: string | null }) =>
  [main, alt].filter(Boolean).join(" / ");

type ProfileDetailsProps = {
  profile: MemberProfile;
};

export function ProfileDetails({ profile }: Readonly<ProfileDetailsProps>) {
  const { membership, rsn, wom } = profile;

  const details: { content: ReactNode; key: string }[] = [
    { content: <PreviousNames rsn={rsn} />, key: "rsn" },
    { content: `Joined ${formatDate(membership.joinedAt)}`, key: "joined" },
    ...(wom?.updatedAt
      ? [
          {
            content: (
              <>
                Last sync <RelativeDate value={wom.updatedAt} />
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
    <Dropdown
      className="w-64"
      triggerClassName="btn-ghost h-auto min-h-0 gap-1 px-1 py-0 text-sm font-normal text-base-content/60"
      label={
        <>
          {name}
          <ChevronDown className="size-3" />
        </>
      }
    >
      <li className="menu-title px-2 py-1">Previously</li>
      {shown.map(({ name: previous, until }) => (
        <li key={previous}>
          <span className="flex justify-between gap-4">
            {previous}
            <span className="text-base-content/60">{formatDate(until)}</span>
          </span>
        </li>
      ))}
      {remaining > 0 && <li className="px-2 py-1 text-base-content/60">and {remaining} more</li>}
    </Dropdown>
  );
}

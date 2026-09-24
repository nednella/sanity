import { Fragment } from "react";

import type { MemberProfile } from "@/lib/api/types";
import { Muted } from "@/lib/ui/typography/muted";
import { formatDate, formatRelativeDate } from "@/utils/dates";

const formatRsn = ({ main, alt }: { main: string | null; alt: string | null }) =>
  [main, alt].filter(Boolean).join(" / ");

type ProfileDetailsProps = {
  profile: MemberProfile;
};

export function ProfileDetails({ profile }: Readonly<ProfileDetailsProps>) {
  const { membership, rsn, wom } = profile;

  const details = [
    formatRsn(rsn),
    `Joined ${formatDate(membership.joinedAt)}`,
    wom?.updatedAt && `Last sync ${formatRelativeDate(wom.updatedAt)}`
  ].filter(Boolean);

  return (
    <Muted className="flex flex-wrap items-center gap-x-2 gap-y-1">
      {details.map((detail, index) => (
        <Fragment key={detail}>
          {index > 0 && <span aria-hidden="true">·</span>}
          <span>{detail}</span>
        </Fragment>
      ))}
    </Muted>
  );
}

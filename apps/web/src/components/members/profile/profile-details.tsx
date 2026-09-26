import { Fragment } from "react";
import type { ReactNode } from "react";

import type { MemberProfile } from "@/lib/api/types";
import { RelativeDate } from "@/lib/ui/relative-date";
import { Muted } from "@/lib/ui/typography/muted";
import { formatDate } from "@/utils/dates";

const formatRsn = ({ main, alt }: { main: string | null; alt: string | null }) =>
  [main, alt].filter(Boolean).join(" / ");

type ProfileDetailsProps = {
  profile: MemberProfile;
};

export function ProfileDetails({ profile }: Readonly<ProfileDetailsProps>) {
  const { membership, rsn, wom } = profile;

  const details: { content: ReactNode; key: string }[] = [
    { content: formatRsn(rsn), key: "rsn" },
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

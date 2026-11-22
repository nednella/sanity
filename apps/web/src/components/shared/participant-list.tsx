import { Link } from "@tanstack/react-router";
import { Fragment } from "react";

import type { MemberRef } from "@sanity/api";
import { DASH, formatNumber } from "@sanity/utils";

type Participant = MemberRef & {
  points?: number | null;
};

type ParticipantListProps = {
  // We use this on the member profile to highlight a user in the list
  memberId?: string;
  participants: Participant[];
};

export function ParticipantList({ memberId, participants }: Readonly<ParticipantListProps>) {
  if (participants.length === 0) return DASH;

  function emphasis(id: string) {
    if (memberId === undefined) return "";
    return id === memberId ? "font-medium" : "text-muted-foreground";
  }

  return participants.map(({ displayName, id, points }, index) => (
    <Fragment key={id}>
      {index > 0 && <span className="text-muted-foreground/50">, </span>}
      <span className={emphasis(id)}>
        <Link
          className="link link-hover"
          params={{ memberId: id }}
          to="/members/$memberId"
        >
          {displayName}
        </Link>
        {points != null && ` (${formatNumber(points)})`}
      </span>
    </Fragment>
  ));
}

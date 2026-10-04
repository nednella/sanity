import { Link } from "@tanstack/react-router";
import { Fragment } from "react";

import type { MemberRef } from "@sanity/api";

import { DASH } from "@/utils/dash";
import { formatNumber } from "@/utils/numbers";

type Participant = MemberRef & {
  points?: number | null;
};

type ParticipantListProps = {
  memberId?: string; // we use this on the member profile to highlight a user in the list
  participants: Participant[];
};

export function ParticipantList({ memberId, participants }: Readonly<ParticipantListProps>) {
  if (participants.length === 0) return DASH;

  const emphasis = (id: string) => {
    if (memberId === undefined) return "";
    return id === memberId ? "font-medium" : "text-base-content/60";
  };

  return participants.map(({ displayName, id, points }, index) => (
    <Fragment key={id}>
      {index > 0 && <span className="text-base-content/30">, </span>}
      <span className={emphasis(id)}>
        <Link
          to="/members/$memberId"
          params={{ memberId: id }}
          className="link link-hover"
        >
          {displayName}
        </Link>
        {points != null && ` (${formatNumber(points)})`}
      </span>
    </Fragment>
  ));
}

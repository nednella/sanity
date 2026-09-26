import { Link } from "@tanstack/react-router";
import { Fragment } from "react";

import type { MemberRef } from "@/lib/api/types";
import { DASH } from "@/utils/dash";
import { formatNumber } from "@/utils/numbers";

type Participant = MemberRef & {
  points?: number | null;
};

type ParticipantListProps = {
  // Whose profile this is, so their own share reads out of the crowd.
  memberId: string;
  participants: Participant[];
};

export function ParticipantList({ memberId, participants }: Readonly<ParticipantListProps>) {
  if (participants.length === 0) return DASH;

  return participants.map(({ displayName, id, points }, index) => (
    <Fragment key={id}>
      {index > 0 && <span className="text-base-content/30">, </span>}
      <span className={id === memberId ? "font-medium" : "text-base-content/60"}>
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

import { db } from "@db/index";

import type { Actor } from "@/modules/auth/service/authenticate";

import { savePersonalBest } from "../repository/save-personal-best";

export type NewPersonalBest = {
  contentId: number;
  imageUrl: string | null;
  participants: bigint[];
  scale: number;
  timeSeconds: number;
};

/**
 * A run arrives waiting for review, and its time is stored as an interval so Postgres holds the
 * hundredths the game reports rather than a float we would have to round back.
 */
export const createPersonalBest = async (
  { participants, timeSeconds, ...personalBest }: NewPersonalBest,
  actor: Actor
) =>
  db.transaction(async (tx) =>
    savePersonalBest(
      tx,
      {
        ...personalBest,
        memberId: actor.memberId,
        status: "submitted",
        submittedAt: new Date(),
        time: `${timeSeconds} seconds`
      },
      participants
    )
  );

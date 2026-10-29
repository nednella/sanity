import { db } from "@db/index";

import type { Auth } from "@/modules/auth/hooks/authenticate";

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
export async function createPersonalBest({ participants, timeSeconds, ...personalBest }: NewPersonalBest, auth: Auth) {
  return db.transaction(async (tx) =>
    savePersonalBest(
      tx,
      {
        ...personalBest,
        memberId: auth.member.id,
        status: "submitted",
        submittedAt: new Date(),
        time: `${timeSeconds} seconds`
      },
      participants
    )
  );
}

import { eq } from "drizzle-orm";

import type { Transaction } from "@db/index";
import { personalBestParticipants } from "@db/schema";

export const listParticipantIds = async (tx: Transaction, personalBestId: number) => {
  const rows = await tx
    .select({ memberId: personalBestParticipants.memberId })
    .from(personalBestParticipants)
    .where(eq(personalBestParticipants.personalBestId, personalBestId));

  return rows.map(({ memberId }) => memberId);
};

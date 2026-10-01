import type { Transaction } from "@db/index";
import { personalBestParticipants, personalBests } from "@db/schema";

export type PersonalBestRow = typeof personalBests.$inferInsert;

export const savePersonalBest = async (tx: Transaction, personalBest: PersonalBestRow, participants: bigint[]) => {
  const [saved] = await tx.insert(personalBests).values(personalBest).returning({ id: personalBests.id });

  const unique = [...new Set(participants)];
  if (unique.length > 0) {
    await tx
      .insert(personalBestParticipants)
      .values(unique.map((memberId) => ({ memberId, personalBestId: saved!.id })));
  }

  return saved!.id;
};

import type { Transaction } from "@db/index";

import { awardPoints } from "@/modules/points/repository/award-points";
import { findLiveMultiplier } from "@/modules/points/repository/find-live-multiplier";
import { generateDiaryCarryAwards } from "@/modules/points/rules";
import { getEliteAndMasterDiaryTimes } from "@/modules/speedrun-diary/repository/get-elite-and-master-diary-times";

import { listBestTimes } from "../../repository/list-best-times";

export type ApprovedRun = {
  contentId: number;
  id: number;
  scale: number;
  submittedAt: Date | null;
  timeSeconds: number;
};

export async function payDiaryCarries(tx: Transaction, run: ApprovedRun, memberIds: bigint[], awardedBy: bigint) {
  const tiers = await getEliteAndMasterDiaryTimes(tx, run.contentId, run.scale);
  const bestTimes = await listBestTimes(tx, {
    contentId: run.contentId,
    excludeId: run.id,
    memberIds,
    scale: run.scale
  });

  const multiplier = await findLiveMultiplier(tx, { at: run.submittedAt ?? new Date(), itemId: null, memberIds });
  const boost = multiplier ? ` x${multiplier.value}` : "";

  for (const tier of tiers) {
    if (run.timeSeconds > tier.timeSeconds) continue;

    const hasDiaryTier = (memberId: bigint) => (bestTimes.get(memberId) ?? Infinity) <= tier.timeSeconds;

    const awards = generateDiaryCarryAwards({
      carried: memberIds.filter((memberId) => !hasDiaryTier(memberId)),
      holders: memberIds.filter((memberId) => hasDiaryTier(memberId)),
      multiplier: multiplier?.value ?? 1,
      tierId: tier.tierId
    });

    await awardPoints(
      tx,
      awards,
      awardedBy,
      null,
      `${tier.tierName.toLowerCase()} diary carry - pb #${run.id}${boost}`
    );
  }
}

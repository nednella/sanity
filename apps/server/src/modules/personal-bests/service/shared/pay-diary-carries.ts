import type { Transaction } from "@db/index";

import { awardPoints } from "@/modules/points/repository/award-points";
import { generateDiaryCarryAwards } from "@/modules/points/rules";
import { getEliteAndMasterDiaryTimes } from "@/modules/speedrun-diary/repository/get-elite-and-master-diary-times";

import { listBestTimes } from "../../repository/list-best-times";

export type ApprovedRun = {
  contentId: number;
  id: number;
  scale: number;
  timeSeconds: number;
};

export const payDiaryCarries = async (tx: Transaction, run: ApprovedRun, memberIds: bigint[]) => {
  const tiers = await getEliteAndMasterDiaryTimes(tx, run.contentId, run.scale);
  const bestTimes = await listBestTimes(tx, {
    contentId: run.contentId,
    excludeId: run.id,
    memberIds,
    scale: run.scale
  });

  for (const tier of tiers) {
    if (run.timeSeconds > tier.timeSeconds) continue;

    const hasDiaryTier = (memberId: bigint) => (bestTimes.get(memberId) ?? Infinity) <= tier.timeSeconds;

    const awards = generateDiaryCarryAwards({
      carried: memberIds.filter((memberId) => !hasDiaryTier(memberId)),
      holders: memberIds.filter((memberId) => hasDiaryTier(memberId)),
      tierId: tier.tierId
    });

    await awardPoints(tx, awards, null, `${tier.tierName.toLowerCase()} diary carry - pb #${run.id}`);
  }
};

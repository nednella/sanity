import type { Transaction } from "@db/index";

import { recordAuditEntry } from "@/modules/audit/repository/record-audit-entry";
import { awardPoints } from "@/modules/points/repository/award-points";
import { RANK_IDS_OFF_LADDER } from "@/modules/ranks/rules";
import { listDiaryRewards } from "@/modules/speedrun-diary/repository/list-diary-rewards";

import { listMemberStandings } from "../../repository/list-member-standings";
import { setClaimedDiaryTier } from "../../repository/set-claimed-diary-tier";

/**
 * A tier is claimed once, when a member's diary points first reach it, and pays its clan points
 * then. Clearing several tiers at once claims each in turn, since each pays its own reward.
 * Trialists wait until they pass, as they did under the old loop: their next approved run claims
 * everything they have earned by then.
 */
export const claimEarnedDiaryTiers = async (tx: Transaction, memberIds: bigint[]) => {
  const rewards = await listDiaryRewards(tx);
  const standings = await listMemberStandings(tx, memberIds);

  for (const standing of standings) {
    if (RANK_IDS_OFF_LADDER.has(standing.rankId)) continue;

    const due = rewards.filter(
      ({ requiredDiaryPoints, tierId }) =>
        tierId > (standing.claimedDiaryTierId ?? 0) && standing.diaryPoints >= requiredDiaryPoints
    );

    for (const { clanPoints, tierId, tierName } of due) {
      const tier = `${tierName.toLowerCase()} diary tier`;

      await setClaimedDiaryTier(tx, standing.id, tierId);
      await awardPoints(tx, [{ memberId: standing.id, points: clanPoints }], null, tier);
      await recordAuditEntry(tx, {
        action: "diary_tier_claimed",
        affects: [standing.id],
        note: `${tier} for ${clanPoints} points`,
        source: "server"
      });
    }
  }
};

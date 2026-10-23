import { db } from "@db/index";

import { type ItemValue, findItemValue } from "@/modules/catalogue/repository/find-item-value";

import { type SubmissionRow, saveSubmission } from "../repository/save-submission";

export type NewSubmission = Omit<SubmissionRow, "memberId" | "status" | "submittedAt" | "valueMillions"> & {
  participants: bigint[];
  submittedByMemberId: bigint;
  valueMillions: number;
};

// Raid uniques pay at least their floor, so their rarity still counts when the price falls. Pets pay a set value.
const applyItemValue = (entered: number, item: ItemValue) => {
  if (!item?.valueRule || item.valueMillions === null) return entered;
  return item.valueRule === "exact" ? item.valueMillions : Math.max(entered, item.valueMillions);
};

// A submission arrives waiting for review. Nothing it claims is trusted until someone approves it,
// and no points exist until then.
export const createSubmission = async ({
  participants,
  submittedByMemberId,
  valueMillions,
  ...submission
}: NewSubmission) =>
  db.transaction(async (tx) => {
    const item = submission.itemId ? await findItemValue(tx, submission.itemId) : undefined;

    return saveSubmission(
      tx,
      {
        ...submission,
        memberId: submittedByMemberId,
        status: "submitted",
        submittedAt: new Date(),
        valueMillions: applyItemValue(valueMillions, item)
      },
      participants
    );
  });

import { db } from "@db/index";

import { recordAuditEntry } from "@/modules/audit/repository/record-audit-entry";
import { findMemberIdByDiscordId } from "@/modules/members/repository/find-member-id-by-discord-id";

import { type DiaryTimeKey, updateDiaryTime } from "../repository/update-diary-time";

export type DiaryTimeChange = {
  actingDiscordId?: bigint;
  timeSeconds: number;
};

export const editDiaryTime = async (key: DiaryTimeKey, { actingDiscordId, timeSeconds }: DiaryTimeChange) =>
  db.transaction(async (tx) => {
    const previous = await updateDiaryTime(tx, key, timeSeconds);
    if (!previous) return false;

    await recordAuditEntry(tx, {
      actingMemberId: await findMemberIdByDiscordId(tx, actingDiscordId),
      action: "catalogue_changed",
      note: `${previous.contentName} ${key.scale} man ${previous.tierName} time ${previous.timeSeconds}s to ${timeSeconds}s`,
      source: "server"
    });

    return true;
  });

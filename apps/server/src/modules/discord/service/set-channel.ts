import { db } from "@db/index";
import type { discordChannels } from "@db/schema";

import { recordAuditEntry } from "@/modules/audit/repository/record-audit-entry";
import type { Actor } from "@/modules/auth/service/authenticate";

import { setChannel } from "../repository/set-channel";

export type SetChannelCommand = {
  channelId: bigint;
  purpose: (typeof discordChannels.$inferInsert)["purpose"];
};

export const setDiscordChannel = async ({ channelId, purpose }: SetChannelCommand, actor: Actor) =>
  db.transaction(async (tx) => {
    await setChannel(tx, purpose, channelId);
    await recordAuditEntry(tx, {
      actingMemberId: actor.memberId,
      action: "catalogue_changed",
      note: `${purpose} channel set to ${channelId}`,
      source: actor.source
    });
  });

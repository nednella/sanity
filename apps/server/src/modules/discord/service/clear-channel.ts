import { db } from "@db/index";
import type { discordChannels } from "@db/schema";

import { recordAuditEntry } from "@/modules/audit/repository/record-audit-entry";
import { findMemberIdByDiscordId } from "@/modules/members/repository/find-member-id-by-discord-id";

import { clearChannel } from "../repository/clear-channel";

export type ClearChannelCommand = {
  actingDiscordId?: bigint;
  purpose: (typeof discordChannels.$inferInsert)["purpose"];
};

export const clearDiscordChannel = async ({ actingDiscordId, purpose }: ClearChannelCommand) =>
  db.transaction(async (tx) => {
    await clearChannel(tx, purpose);
    await recordAuditEntry(tx, {
      actingMemberId: await findMemberIdByDiscordId(tx, actingDiscordId),
      action: "catalogue_changed",
      note: `${purpose} channel cleared`,
      source: "server"
    });
  });

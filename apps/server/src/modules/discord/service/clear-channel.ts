import { db } from "@db/index";
import type { discordChannels } from "@db/schema";

import { recordAuditEntry } from "@/modules/audit/repository/record-audit-entry";
import type { Auth } from "@/modules/auth/hooks/authenticate";

import { clearChannel } from "../repository/clear-channel";

export type DiscordChannelRef = {
  purpose: (typeof discordChannels.$inferInsert)["purpose"];
};

export async function clearDiscordChannel({ purpose }: DiscordChannelRef, auth: Auth) {
  return db.transaction(async (tx) => {
    await clearChannel(tx, purpose);
    await recordAuditEntry(tx, {
      actingMemberId: auth.member.id,
      action: "catalogue_changed",
      note: `${purpose} channel cleared`,
      source: auth.client
    });
  });
}

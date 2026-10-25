import { db } from "@db/index";
import type { discordChannels } from "@db/schema";

import { recordAuditEntry } from "@/modules/audit/repository/record-audit-entry";
import type { Auth } from "@/modules/auth/service/authenticate";

import { clearChannel } from "../repository/clear-channel";

export type ClearChannelCommand = {
  purpose: (typeof discordChannels.$inferInsert)["purpose"];
};

export const clearDiscordChannel = async ({ purpose }: ClearChannelCommand, auth: Auth) =>
  db.transaction(async (tx) => {
    await clearChannel(tx, purpose);
    await recordAuditEntry(tx, {
      actingMemberId: auth.member.id,
      action: "catalogue_changed",
      note: `${purpose} channel cleared`,
      source: auth.client
    });
  });

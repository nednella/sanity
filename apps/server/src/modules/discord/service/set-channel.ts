import { db } from "@db/index";
import type { discordChannels } from "@db/schema";

import { recordAuditEntry } from "@/modules/audit/repository/record-audit-entry";
import { findMemberIdByDiscordId } from "@/modules/members/repository/find-member-id-by-discord-id";

import { setChannel } from "../repository/set-channel";

export type SetChannelCommand = {
  actingDiscordId?: bigint;
  channelId: bigint;
  purpose: (typeof discordChannels.$inferInsert)["purpose"];
};

export const setDiscordChannel = async ({ actingDiscordId, channelId, purpose }: SetChannelCommand) =>
  db.transaction(async (tx) => {
    await setChannel(tx, purpose, channelId);
    await recordAuditEntry(tx, {
      actingMemberId: await findMemberIdByDiscordId(tx, actingDiscordId),
      action: "catalogue_changed",
      note: `${purpose} channel set to ${channelId}`,
      source: "server"
    });
  });

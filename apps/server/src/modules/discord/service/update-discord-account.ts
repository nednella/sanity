import { db } from "@db/index";

import { recordAuditEntry } from "@/modules/audit/repository/record-audit-entry";
import { findMemberIdByDiscordId } from "@/modules/members/repository/find-member-id-by-discord-id";
import { listMembersByDisplayName } from "@/modules/members/repository/list-members-by-display-name";

import { type DiscordAccount, toAvatarUrl } from "../mapper";
import { setDiscordAccount } from "../repository/set-discord-account";

export type UpdateDiscordAccountCommand = {
  account: DiscordAccount;
  actingDiscordId?: bigint;
  displayName: string;
};

/**
 * The member is named rather than tagged: the account being replaced may have left the server or
 * been banned, so a mention would not resolve.
 */
export const updateDiscordAccount = async ({ account, actingDiscordId, displayName }: UpdateDiscordAccountCommand) =>
  db.transaction(async (tx) => {
    const matches = await listMembersByDisplayName(tx, displayName);
    const [member] = matches;
    if (!member) return { member: null, outcome: "not-a-member" as const };
    if (matches.length > 1) return { member: null, outcome: "non-unique-display-name" as const };

    const summary = { displayName: member.displayName, id: member.id };
    if (member.discordId === account.discordId) return { member: summary, outcome: "unchanged" as const };
    if ((await findMemberIdByDiscordId(tx, account.discordId)) !== undefined) {
      return { member: summary, outcome: "discord-id-taken" as const };
    }

    await setDiscordAccount(tx, member.id, { avatarUrl: toAvatarUrl(account), discordId: account.discordId });
    await recordAuditEntry(tx, {
      actingMemberId: await findMemberIdByDiscordId(tx, actingDiscordId),
      action: "discord_id_changed",
      affects: [member.id],
      note: `discord id ${member.discordId} to ${account.discordId}`,
      source: "server"
    });

    return { member: summary, outcome: "discord-account-changed" as const };
  });

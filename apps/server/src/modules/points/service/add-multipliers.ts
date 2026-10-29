import { type Transaction, db } from "@db/index";

import { recordAuditEntry } from "@/modules/audit/repository/record-audit-entry";
import type { Auth } from "@/modules/auth/hooks/authenticate";
import { findBossByName } from "@/modules/catalogue/repository/find-boss-by-name";
import { listMembersByDiscordId } from "@/modules/members/repository/list-members-by-discord-id";

import { pointErrors } from "../errors";
import { saveMultipliers } from "../repository/save-multipliers";

const DAY_MS = 24 * 60 * 60 * 1000;

export type NewMultipliers = {
  bossName: string | null;
  days: number;
  reason: string;
  taggedDiscordIds: bigint[];
  value: number;
};

async function resolveBoss(tx: Transaction, bossName: string | null) {
  if (bossName === null) return null;

  const boss = await findBossByName(tx, bossName);
  if (!boss) throw pointErrors.bossNotFound(bossName);

  return boss;
}

async function resolveMembers(tx: Transaction, taggedDiscordIds: bigint[]) {
  const discordIds = [...new Set(taggedDiscordIds)];
  const found = await listMembersByDiscordId(tx, discordIds);

  const missing = discordIds.filter((discordId) => !found.has(discordId));
  if (missing.length > 0) throw pointErrors.notMembers(missing);

  return Array.from(found.values(), ({ displayName, id }) => ({ displayName, id }));
}

function describeMultiplier(value: number, days: number, bossName: string | undefined, reason: string) {
  const boss = bossName ? ` on ${bossName}` : "";
  return `x${value} for ${days} days${boss}: ${reason}`;
}

/**
 * A multiplier for nobody in particular is saved once and applies to every member. Tagged members
 * each get their own row, so that a drop finds the buff of whoever is on it.
 */
export async function addMultipliers({ bossName, days, reason, taggedDiscordIds, value }: NewMultipliers, auth: Auth) {
  return db.transaction(async (tx) => {
    const boss = await resolveBoss(tx, bossName);
    const members = await resolveMembers(tx, taggedDiscordIds);

    const startsAt = new Date();
    const endsAt = new Date(startsAt.getTime() + days * DAY_MS);
    const memberIds = members.length === 0 ? [null] : members.map(({ id }) => id);

    const saved = await saveMultipliers(
      tx,
      memberIds.map((memberId) => ({
        bossId: boss?.id ?? null,
        endsAt,
        memberId,
        reason,
        startsAt,
        value
      }))
    );

    await recordAuditEntry(tx, {
      actingMemberId: auth.member.id,
      action: "point_multiplier_added",
      affects: members.map(({ id }) => id),
      note: describeMultiplier(value, days, boss?.name, reason),
      source: auth.client
    });

    return saved.map(({ memberId, ...multiplier }) => ({
      ...multiplier,
      bossName: boss?.name ?? null,
      member: members.find(({ id }) => id === memberId) ?? null
    }));
  });
}

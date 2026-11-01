import { listRanks } from "@/modules/ranks/repository/list-ranks";
import { findLatestSnapshot } from "@/modules/wom/repository/find-latest-snapshot";
import { listNameChanges } from "@/modules/wom/repository/list-name-changes";

import { memberErrors } from "../errors";
import { toMemberProfile } from "../mapper";
import { findMemberByDiscordId, findMemberById } from "../repository/find-member";
import type { MemberRow } from "../repository/shared/select-members";

async function buildMemberProfile(row: MemberRow) {
  const [ranks, latestSnapshot, nameChanges] = await Promise.all([
    listRanks(),
    row.womPlayer ? findLatestSnapshot(row.womPlayer.womPlayerId) : undefined,
    row.womPlayer ? listNameChanges(row.womPlayer.womPlayerId) : []
  ]);

  return toMemberProfile(row, ranks, latestSnapshot, nameChanges);
}

export async function getMemberProfileById(id: bigint) {
  const member = await findMemberById(id);
  if (!member) throw memberErrors.notFoundById(id);

  return buildMemberProfile(member);
}

export async function getMemberProfileByDiscordId(discordId: bigint) {
  const member = await findMemberByDiscordId(discordId);
  if (!member) throw memberErrors.notFoundByDiscordId(discordId);

  return buildMemberProfile(member);
}

import { memberErrors } from "@/modules/members/errors";
import { toMemberProfile } from "@/modules/members/mapper";
import { findMemberByDiscordId, findMemberById } from "@/modules/members/repository/find-member";
import type { MemberRow } from "@/modules/members/repository/shared/select-members";
import { listRanks } from "@/modules/ranks/repository/list-ranks";
import { findLatestSnapshot } from "@/modules/wom/repository/find-latest-snapshot";
import { listNameChanges } from "@/modules/wom/repository/list-name-changes";

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

async function buildMemberProfile(row: MemberRow) {
  const [ranks, latestSnapshot, nameChanges] = await Promise.all([
    listRanks(),
    row.womPlayer ? findLatestSnapshot(row.womPlayer.womPlayerId) : undefined,
    row.womPlayer ? listNameChanges(row.womPlayer.womPlayerId) : []
  ]);

  return toMemberProfile(row, ranks, latestSnapshot, nameChanges);
}

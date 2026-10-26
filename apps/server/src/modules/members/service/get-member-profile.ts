import { listRanks } from "@/modules/ranks/repository/list-ranks";
import { findLatestSnapshot } from "@/modules/wom/repository/find-latest-snapshot";
import { listNameChanges } from "@/modules/wom/repository/list-name-changes";

import { memberErrors } from "../errors";
import { toMemberProfile } from "../mapper";
import { findMember } from "../repository/find-member";
import { findMemberIdByName } from "../repository/find-member-id-by-name";

async function findMemberId(member: bigint | string) {
  if (typeof member === "bigint") return member;

  const id = await findMemberIdByName(member);
  if (id === undefined) throw memberErrors.nameNotFound(member);

  return id;
}

export const getMemberProfile = async (member: bigint | string) => {
  const id = await findMemberId(member);
  const row = await findMember(id);
  if (!row) throw memberErrors.notFound(id);

  const [ranks, latestSnapshot, nameChanges] = await Promise.all([
    listRanks(),
    row.womPlayer ? findLatestSnapshot(row.womPlayer.womPlayerId) : undefined,
    row.womPlayer ? listNameChanges(row.womPlayer.womPlayerId) : []
  ]);

  return toMemberProfile(row, ranks, latestSnapshot, nameChanges);
};

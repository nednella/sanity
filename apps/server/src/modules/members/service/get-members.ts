import { toMember } from "@/modules/members/mapper";
import { countMembers } from "@/modules/members/repository/count-members";
import { type ListMembersOptions, listMembers } from "@/modules/members/repository/list-members";

export async function getMembers(options: ListMembersOptions) {
  const [rows, total] = await Promise.all([listMembers(options), countMembers(options)]);

  return {
    items: rows.map((row) => toMember(row)),
    total
  };
}

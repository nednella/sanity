import { toMember } from "../mapper";
import { countMembers } from "../repository/count-members";
import { type ListMembersOptions, listMembers } from "../repository/list-members";

export const getMembers = async (options: ListMembersOptions) => {
  const [rows, total] = await Promise.all([listMembers(options), countMembers(options)]);

  return {
    items: rows.map((row) => toMember(row)),
    total
  };
};

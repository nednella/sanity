import { eq } from "drizzle-orm";

import { members } from "@db/schema";

import { selectMembers } from "./shared/select-members";

export const findMember = async (id: bigint) => {
  const [row] = await selectMembers().where(eq(members.id, id));
  return row;
};

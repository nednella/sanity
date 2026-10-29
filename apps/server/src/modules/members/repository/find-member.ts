import { eq } from "drizzle-orm";

import { members } from "@db/schema";

import { diaryProgressQueries } from "@/modules/speedrun-diary/repository/diary-progress-queries";

import { selectMembers } from "./shared/select-members";

export async function findMember(id: bigint) {
  const [row] = await selectMembers(diaryProgressQueries([id])).where(eq(members.id, id));
  return row;
}

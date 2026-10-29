import { eq } from "drizzle-orm";

import { members } from "@db/schema";

import { diaryProgressCte } from "@/modules/speedrun-diary/repository/diary-progress-cte";

import { selectMembers } from "./shared/select-members";

export async function findMember(id: bigint) {
  const [row] = await selectMembers(diaryProgressCte([id])).where(eq(members.id, id));
  return row;
}

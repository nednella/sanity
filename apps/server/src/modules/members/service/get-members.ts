import { listDiaryProgress } from "@/modules/speedrun-diary/repository/list-diary-progress";

import { toMember } from "../mapper";
import { countMembers } from "../repository/count-members";
import type { ListMembersOptions } from "../repository/list-members";
import { listMembers } from "../repository/list-members";

export const getMembers = async (options: ListMembersOptions) => {
  const [rows, total] = await Promise.all([listMembers(options), countMembers(options)]);
  const diaryProgress = await listDiaryProgress(rows.map((row) => row.member.id));
  const progressByMember = new Map(diaryProgress.map((progress) => [progress.memberId, progress]));

  return {
    items: rows.map((row) => toMember(row, progressByMember.get(row.member.id))),
    total
  };
};

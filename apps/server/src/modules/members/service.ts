import { listRanks } from "../ranks/repo.js";
import { listDiaryProgress } from "../speedrun-diary/repo.js";
import { findLatestSnapshot } from "../wom/repo.js";
import { toMember, toMemberProfile } from "./mapper.js";
import { countMembers, findMember, listMembers } from "./repo.js";

export const getMembers = async (options: Parameters<typeof listMembers>[0]) => {
  const [rows, total] = await Promise.all([listMembers(options), countMembers(options)]);
  const diaryProgress = await listDiaryProgress(rows.map((row) => row.member.id));
  const progressByMember = new Map(diaryProgress.map((progress) => [progress.memberId, progress]));

  return {
    items: rows.map((row) => toMember(row, progressByMember.get(row.member.id))),
    total
  };
};

export const getMemberProfile = async (id: bigint) => {
  const row = await findMember(id);
  if (!row) return;

  const [diaryProgress] = await listDiaryProgress([id]);
  const ranks = await listRanks();
  const latestSnapshot = row.womPlayer ? await findLatestSnapshot(row.womPlayer.womPlayerId) : undefined;

  return toMemberProfile(row, diaryProgress, ranks, latestSnapshot);
};

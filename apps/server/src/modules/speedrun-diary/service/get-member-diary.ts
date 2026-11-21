import { toMemberDiary } from "@/modules/speedrun-diary/mapper";
import { type DiaryTimeRow, listDiaryTimes } from "@/modules/speedrun-diary/repository/list-diary-times";
import { listMemberBestTimes } from "@/modules/speedrun-diary/repository/list-member-best-times";

/**
 * Every diary the clan tracks, whether or not the member has a time on it.
 */
export async function getMemberDiary(memberId: bigint) {
  const [times, personalBests] = await Promise.all([listDiaryTimes(), listMemberBestTimes(memberId)]);

  const pbFor = new Map(personalBests.map((row) => [toDiaryKey(row), row]));
  const thresholds = new Map<string, [DiaryTimeRow, ...DiaryTimeRow[]]>();

  for (const time of times) {
    const key = toDiaryKey(time);
    const current = thresholds.get(key);
    thresholds.set(key, current ? [...current, time] : [time]);
  }

  return [...thresholds].map(([key, rows]) => toMemberDiary(rows, pbFor.get(key)));
}

function toDiaryKey({ contentId, scale }: { contentId: number | null; scale: number }) {
  return `${contentId}:${scale}`;
}

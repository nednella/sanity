import { toDiary } from "../mapper";
import { type DiaryTimeRow, listDiaryTimes } from "../repository/list-diary-times";

export const getDiary = async () => {
  const times = await listDiaryTimes();
  const diaries = new Map<number, [DiaryTimeRow, ...DiaryTimeRow[]]>();

  for (const time of times) {
    const current = diaries.get(time.contentId);
    diaries.set(time.contentId, current ? [...current, time] : [time]);
  }

  return Array.from(diaries.values(), (rows) => toDiary(rows));
};

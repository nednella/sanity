import type { RankedPersonalBest } from "@sanity/api";

export type RecordWithScale = {
  records: RankedPersonalBest[];
  scale: number;
};

export type RecordGroup = {
  content: RankedPersonalBest["content"];
  scales: RecordWithScale[];
};

export const toRecordGroups = (records: RankedPersonalBest[]) => {
  const groups = new Map<number, RecordGroup>();
  const ordered: RecordGroup[] = [];

  for (const record of records) {
    let group = groups.get(record.content.id);
    if (!group) {
      group = { content: record.content, scales: [] };
      groups.set(record.content.id, group);
      ordered.push(group);
    }

    let scale = group.scales.find((entry) => entry.scale === record.scale);
    if (!scale) {
      scale = { records: [], scale: record.scale };
      group.scales.push(scale);
    }

    scale.records.push(record);
  }

  for (const group of ordered) group.scales = group.scales.toSorted((a, b) => a.scale - b.scale);

  return ordered.toSorted((a, b) => a.content.name.localeCompare(b.content.name));
};

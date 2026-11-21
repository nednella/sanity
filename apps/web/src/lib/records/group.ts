import type { RankedPersonalBest } from "@sanity/api";

export type RecordWithScale = {
  records: RankedPersonalBest[];
  scale: number;
};

export type RecordGroup = {
  content: RankedPersonalBest["content"];
  scales: RecordWithScale[];
};

export function toRecordGroups(records: RankedPersonalBest[]) {
  const groups = new Map<number, RecordGroup>();

  for (const record of records) {
    const group = findOrAddGroup(groups, record.content);
    const scale = findOrAddScale(group, record.scale);
    scale.records.push(record);
  }

  const ordered = [...groups.values()];
  for (const group of ordered) group.scales = group.scales.toSorted((a, b) => a.scale - b.scale);

  return ordered.toSorted((a, b) => a.content.name.localeCompare(b.content.name));
}

function findOrAddGroup(groups: Map<number, RecordGroup>, content: RecordGroup["content"]) {
  const existing = groups.get(content.id);
  if (existing) return existing;

  const group: RecordGroup = {
    content,
    scales: []
  };
  groups.set(content.id, group);
  return group;
}

function findOrAddScale(group: RecordGroup, scale: number) {
  const existing = group.scales.find((entry) => entry.scale === scale);
  if (existing) return existing;

  const added: RecordWithScale = {
    records: [],
    scale
  };
  group.scales.push(added);
  return added;
}

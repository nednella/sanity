import { blankToNull, read, toUtcInstant } from "./source";

/**
0 is neither; the old bot wrote 1 for bingo and 2 for leagues.
*/
const events: Record<number, "bingo" | "leagues" | null> = { 0: null, 1: "bingo", 2: "leagues" };

export async function readItems() {
  const rows = await read<{ id: number; name: string }>("drops", "id");

  return rows.map((item) => ({ id: item.id, name: item.name }));
}

type MemberIds = Map<string, bigint>;

type SourceSubmission = {
  bingo: number | null;
  Id: number;
  imageUrl: string | null;
  messageUrl: string | null;
  notes: string | null;
  reviewedBy: string | null;
  reviewedDate: string | null;
  reviewNote: string | null;
  status: number;
  submittedDate: string;
  userId: string;
  value: number | null;
};

export async function readSubmissions(memberIds: MemberIds, itemIds: Map<string, number>) {
  const statusRows = await read<{ id: number; name: string }>("submissionstatus");
  const statuses = new Map(statusRows.map((row) => [row.id, enumName(row.name)]));
  const rows = await read<SourceSubmission>("submissions", "Id");

  return rows.map((row) => {
    const itemName = blankToNull(row.notes);

    return {
      // Source ids are kept so a submission quoted in Discord still resolves.
      id: row.Id,
      memberId: memberIds.get(row.userId)!,
      itemId: itemName ? (itemIds.get(itemName.toLowerCase()) ?? null) : null,
      itemName,
      valueMillions: row.value,
      imageUrl: blankToNull(row.imageUrl),
      discordMessageUrl: blankToNull(row.messageUrl),
      event: events[row.bingo ?? 0] ?? null,
      status: statuses.get(row.status) as "approved",
      submittedAt: toUtcInstant(row.submittedDate)!,
      reviewedBy: row.reviewedBy ? (memberIds.get(row.reviewedBy) ?? null) : null,
      reviewedAt: toUtcInstant(row.reviewedDate),
      reviewNote: blankToNull(row.reviewNote),
      source: "bot" as const
    };
  });
}

export async function readSubmissionParticipants(memberIds: MemberIds) {
  const rows = await read<{ dropId: number | null; userId: string | null }>("submission_participants", "id");
  const seen = new Set<string>();

  return rows.flatMap((row) => {
    if (row.dropId === null || row.userId === null) return [];

    const memberId = memberIds.get(row.userId);
    if (memberId === undefined) return [];

    // The source let a member appear twice on one submission; the key forbids
    // it.
    const key = `${row.dropId}:${memberId}`;
    if (seen.has(key)) return [];
    seen.add(key);

    return [{ submissionId: row.dropId, memberId }];
  });
}

type SourcePoint = {
  date: string;
  dropId: number | null;
  Id: number;
  notes: string | null;
  points: number;
  userId: string;
};

export async function readPoints(memberIds: MemberIds) {
  const rows = await read<SourcePoint>("pointtracker", "Id");

  return rows.map((row) => ({
    id: BigInt(row.Id),
    memberId: memberIds.get(row.userId)!,
    submissionId: row.dropId,
    value: row.points,
    notes: blankToNull(row.notes),
    awardedAt: toUtcInstant(row.date)!
  }));
}

export async function readPointsTimelineEvents() {
  const rows = await read<{ date: string | null; eventName: string | null; id: number }>(
    "pointtrackerOverTimeEvents",
    "id"
  );

  return rows
    .filter((row) => row.eventName !== null && row.date !== null)
    .map((row) => ({ id: row.id, name: capitalise(row.eventName!), occurredAt: toUtcInstant(row.date)! }));
}

function enumName(name: string) {
  return name.trim().toLowerCase().replaceAll(" ", "_");
}

function capitalise(name: string) {
  return name.replaceAll(/\b\w/g, (letter) => letter.toUpperCase());
}

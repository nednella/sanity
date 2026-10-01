import { auditAction, auditSource } from "@db/schema";

import { read, toUtcInstant } from "./source";

type SourceAuditLog = {
  id: number;
  userId: string;
  affectedUsers: string | null;
  actionType: number;
  actionNote: string | null;
  actionDate: string;
};

type Action = (typeof auditAction.enumValues)[number];

const DROP_ACCEPT = 7;
const EMBED_ACTION = 3;
const LOOP = 8;
const WEBSITE = 10;

// The accounts a scheduled job logged itself under. Any other actor on a loop row is a real person.
const BOT_ACCOUNTS = new Set(["228143014168625153", "979856389868494898"]);

/**
 * A personal best was logged as content, team size and a clock: 'Theatre of Blood:2:21:58.20'. A drop
 * was logged as item and value: 'Abyssal Orphan:100'. Nothing else in the table uses colons.
 */
const isPersonalBestNote = (note: string) => {
  const parts = note.split(":");
  return parts.length >= 4 && /^\d+$/.test(parts[1]!.trim());
};

const matchers: [RegExp, Action][] = [
  [/rank ?(id)? from/i, "rank_changed"],
  [/name from/i, "rsn_changed"],
  [/nitro points/i, "points_awarded"],
  [/diary time entry|diarytime/i, "catalogue_changed"],
  [/^add_points/i, "points_awarded"],
  [/^changed rsn/i, "rsn_changed"],
  [/^diarytierclaimed/i, "diary_tier_claimed"],
  [/role/i, "role_changed"],
  [/^(addboss|adddrop|removedrop|addchannel|updated drop|updated bingo items)/i, "catalogue_changed"],
  [/bingo winner|^updated rank #|:\d+->\d+$/i, "catalogue_changed"],
  [/^removed bingo flag/i, "submission_reviewed"],
  [/^pbid /i, "personal_best_reviewed"],
  [/quitto|^quitted |has left disc/i, "member_left"],
  [/^trail started/i, "member_joined"]
];

/**
 * What the note says wins over how the row arrived: the drop-accept button was reused for quits,
 * value edits and role changes, so trusting its type alone files all of those as drop approvals.
 */
export const toAction = (actionType: number, note: string | null): Action => {
  if (!note) return "other";
  if (isPersonalBestNote(note)) return "personal_best_reviewed";

  const matched = matchers.find(([pattern]) => pattern.test(note))?.[1];
  if (matched) return matched;

  if (actionType === DROP_ACCEPT) return "submission_reviewed";
  if (actionType === EMBED_ACTION) return "personal_best_reviewed";

  return "other";
};

const toSource = (actionType: number): (typeof auditSource.enumValues)[number] => {
  if (actionType === LOOP) return "worker";
  if (actionType === WEBSITE) return "web_app";

  return "bot";
};

export const readAuditLog = async (memberIds: Map<string, bigint>) => {
  const rows = await read<SourceAuditLog>("auditlogs", "id");

  return rows.map((row) => ({
    entry: {
      id: BigInt(row.id),
      actingMemberId: BOT_ACCOUNTS.has(row.userId) ? null : (memberIds.get(row.userId) ?? null),
      action: toAction(row.actionType, row.actionNote),
      note: row.actionNote?.trim() || null,
      occurredAt: toUtcInstant(row.actionDate)!,
      source: toSource(row.actionType)
    },
    // The source let the same member appear twice in one list; the key forbids it.
    affects: [
      ...new Set(
        // A trialist on a drop was written with a trailing asterisk, so the id needs stripping
        // before it will match. Anything else in the column is free text and no member at all.
        (row.affectedUsers ?? "").split(",").flatMap((listed) => {
          const memberId = memberIds.get(listed.replaceAll(/\D/g, ""));
          return memberId === undefined ? [] : [memberId];
        })
      )
    ]
  }));
};

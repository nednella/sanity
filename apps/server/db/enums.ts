import { pgEnum } from "drizzle-orm/pg-core";

export const reviewStatus = pgEnum("review_status", [
  "pending",
  "submitted",
  "approved",
  "approved_missing_member",
  "denied",
  "deleted_by_user"
]);
export type ReviewStatus = (typeof reviewStatus.enumValues)[number];

export const submissionEvent = pgEnum("submission_event", ["bingo", "leagues"]);
export type SubmissionEvent = (typeof submissionEvent.enumValues)[number];

export const auditAction = pgEnum("audit_action", [
  "catalogue_changed",
  "diary_tier_claimed",
  "discord_id_changed",
  "member_joined",
  "member_left",
  "other",
  "personal_best_reviewed",
  "points_awarded",
  "rank_changed",
  "role_changed",
  "rsn_changed",
  "submission_reviewed"
]);
export type AuditAction = (typeof auditAction.enumValues)[number];

export const auditSource = pgEnum("audit_source", ["bot", "server", "web_app", "worker"]);
export type AuditSource = (typeof auditSource.enumValues)[number];

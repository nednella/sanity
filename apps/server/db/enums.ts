import { pgEnum } from "drizzle-orm/pg-core";

export const apiClient = pgEnum("api_client", ["bot", "plugin", "web"] as const satisfies readonly AuditSource[]);
export type ApiClient = (typeof apiClient.enumValues)[number];

export const auditAction = pgEnum("audit_action", [
  "catalogue_changed",
  "diary_tier_claimed",
  "discord_id_changed",
  "member_joined",
  "member_left",
  "other",
  "personal_best_reviewed",
  "plugin_access_changed",
  "points_awarded",
  "rank_changed",
  "role_changed",
  "rsn_changed",
  "submission_reviewed"
]);
export type AuditAction = (typeof auditAction.enumValues)[number];

export const auditSource = pgEnum("audit_source", ["bot", "plugin", "server", "web", "worker"]);
export type AuditSource = (typeof auditSource.enumValues)[number];

export const memberRole = pgEnum("member_role", ["admin", "superuser"]);
export type MemberRole = (typeof memberRole.enumValues)[number];

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

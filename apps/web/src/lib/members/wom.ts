import type { MemberProfile } from "@sanity/api";

/**
 * Why a member has no Wise Old Man data.
 */
export const womEmptyMessage = ({ rsn }: MemberProfile) =>
  rsn.main ? "This member has not synced with Wise Old Man yet." : "No RuneScape name on record for this member.";

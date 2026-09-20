import type { paths } from "@sanity/api/v1";

type MemberList = paths["/v1/members"]["get"];

export type Member = MemberList["responses"][200]["content"]["application/json"]["items"][number];
export type MemberListQuery = NonNullable<MemberList["parameters"]["query"]>;
export type MemberSort = NonNullable<MemberListQuery["sort"]>;

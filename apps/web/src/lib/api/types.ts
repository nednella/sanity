import type { components, paths } from "@sanity/api/v1";

type Schemas = components["schemas"];

export type Member = Schemas["Member"];
export type MemberProfile = Schemas["MemberProfile"];
export type Rank = Schemas["Rank"];
export type Snapshot = Schemas["Snapshot"];
export type Skill = Schemas["Skill"];
export type Boss = Schemas["Boss"];
export type Activity = Schemas["Activity"];
export type PersonalBest = Schemas["PersonalBest"];
export type RankedPersonalBest = Schemas["RankedPersonalBest"];
export type Submission = Schemas["Submission"];
export type Page = Schemas["Page"];

// A querystring is decomposed into one parameter per property, so it has no component to reference.
type MemberList = paths["/v1/members"]["get"];

export type MemberListQuery = NonNullable<MemberList["parameters"]["query"]>;
export type MemberSort = NonNullable<MemberListQuery["sort"]>;

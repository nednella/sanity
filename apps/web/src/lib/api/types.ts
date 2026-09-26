import type { components } from "@sanity/api/v1";

type Schemas = components["schemas"];

export type Member = Schemas["Member"];
export type MemberProfile = Schemas["MemberProfile"];
export type Rank = Schemas["Rank"];
export type RankSummary = Schemas["RankSummary"];
export type Snapshot = Schemas["Snapshot"];
export type Skill = Schemas["Skill"];
export type Boss = Schemas["Boss"];
export type Activity = Schemas["Activity"];
export type MemberDiary = Schemas["MemberDiary"];
export type PersonalBest = Schemas["PersonalBest"];
export type RankedPersonalBest = Schemas["RankedPersonalBest"];
export type MemberRef = Schemas["MemberRef"];
export type Submission = Schemas["Submission"];
export type Page = Schemas["Page"];
export type MemberSort = Schemas["MemberSort"];
export type PersonalBestSort = Schemas["PersonalBestSort"];
export type SubmissionSort = Schemas["SubmissionSort"];
export type SubmissionEvent = NonNullable<Submission["event"]>;

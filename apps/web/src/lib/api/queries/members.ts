import { api } from "@/lib/api/openapi-client";
import type { MembersSearch } from "@/lib/members/search";
import { toMembersQueryParams } from "@/lib/members/search";
import type { SubmissionsSearch } from "@/lib/members/submissions";
import { toDropsQueryParams, toPersonalBestsQueryParams } from "@/lib/members/submissions";

export const membersOptions = (search: MembersSearch) =>
  api.queryOptions("get", "/v1/members", { params: { query: toMembersQueryParams(search) } });

export const memberProfileOptions = (memberId: string) =>
  api.queryOptions("get", "/v1/members/{id}", { params: { path: { id: memberId } } });

export const memberDiariesOptions = (memberId: string) =>
  api.queryOptions("get", "/v1/members/{id}/diary", { params: { path: { id: memberId } } });

export const memberPersonalBestsOptions = (memberId: string, search: SubmissionsSearch) =>
  api.queryOptions("get", "/v1/members/{id}/personal-bests", {
    params: { path: { id: memberId }, query: toPersonalBestsQueryParams(search) }
  });

export const memberSubmissionsOptions = (memberId: string, search: SubmissionsSearch) =>
  api.queryOptions("get", "/v1/members/{id}/submissions", {
    params: { path: { id: memberId }, query: toDropsQueryParams(search) }
  });

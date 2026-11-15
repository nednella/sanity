import { api } from "@/lib/api/client";
import { type MembersSearch, toMembersQueryParams } from "@/lib/members/search";
import { type SubmissionsSearch, toDropsQueryParams, toPersonalBestsQueryParams } from "@/lib/submissions/search";

export function membersOptions(search: MembersSearch) {
  return api.queryOptions("get", "/v1/members", { params: { query: toMembersQueryParams(search) } });
}

export function memberProfileOptions(memberId: string) {
  return api.queryOptions("get", "/v1/members/{id}", { params: { path: { id: memberId } } });
}

export function memberDiariesOptions(memberId: string) {
  return api.queryOptions("get", "/v1/members/{id}/diary", { params: { path: { id: memberId } } });
}

export function memberPersonalBestsOptions(memberId: string, search: SubmissionsSearch) {
  return api.queryOptions("get", "/v1/members/{id}/personal-bests", {
    params: { path: { id: memberId }, query: toPersonalBestsQueryParams(search) }
  });
}

export function memberSubmissionsOptions(memberId: string, search: SubmissionsSearch) {
  return api.queryOptions("get", "/v1/members/{id}/submissions", {
    params: { path: { id: memberId }, query: toDropsQueryParams(search) }
  });
}

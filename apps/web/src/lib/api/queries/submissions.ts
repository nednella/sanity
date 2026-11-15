import { api } from "@/lib/api/client";
import { type SubmissionsSearch, toDropsQueryParams, toPersonalBestsQueryParams } from "@/lib/submissions/search";

export function submissionsOptions(search: SubmissionsSearch) {
  return api.queryOptions("get", "/v1/submissions", { params: { query: toDropsQueryParams(search) } });
}

export function personalBestsOptions(search: SubmissionsSearch) {
  return api.queryOptions("get", "/v1/personal-bests", { params: { query: toPersonalBestsQueryParams(search) } });
}

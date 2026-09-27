import { api } from "@/lib/api/openapi-client";
import type { SubmissionsSearch } from "@/lib/submissions/search";
import { toDropsQueryParams, toPersonalBestsQueryParams } from "@/lib/submissions/search";

export const submissionsOptions = (search: SubmissionsSearch) =>
  api.queryOptions("get", "/v1/submissions", { params: { query: toDropsQueryParams(search) } });

export const personalBestsOptions = (search: SubmissionsSearch) =>
  api.queryOptions("get", "/v1/personal-bests", { params: { query: toPersonalBestsQueryParams(search) } });

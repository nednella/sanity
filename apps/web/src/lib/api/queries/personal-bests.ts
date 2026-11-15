import { api } from "@/lib/api/client";

export function recordsOptions() {
  return api.queryOptions("get", "/v1/personal-bests/records", { params: { query: { diary: "true", top: 5 } } });
}

export function contentOptions() {
  return api.queryOptions("get", "/v1/personal-bests/content", {});
}

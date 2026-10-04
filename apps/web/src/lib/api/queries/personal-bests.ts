import { api } from "@/lib/api/client";

export const recordsOptions = () =>
  api.queryOptions("get", "/v1/personal-bests/records", { params: { query: { diary: "true", top: 5 } } });

export const contentOptions = () => api.queryOptions("get", "/v1/personal-bests/content", {});

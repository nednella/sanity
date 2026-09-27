import { api } from "@/lib/api/openapi-client";

export const recordsOptions = () =>
  api.queryOptions("get", "/v1/personal-bests/records", { params: { query: { diary: "true", top: 5 } } });

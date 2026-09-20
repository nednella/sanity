import { api } from "@/lib/api/openapi-client";
import type { MembersSearch } from "@/lib/members/search";
import { toMembersQueryParams } from "@/lib/members/search";

export const membersOptions = (search: MembersSearch) =>
  api.queryOptions("get", "/v1/members", { params: { query: toMembersQueryParams(search) } });

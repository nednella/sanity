import { keepPreviousData, queryOptions } from "@tanstack/react-query";

import type { MemberListQuery } from "@sanity/api";

import { api } from "@/lib/api/client";

async function fetchMembers(querystring: MemberListQuery) {
  const result = await api.members.list({ querystring });
  if (result.status !== 200) throw new Error("Failed to load members");
  return result.body;
}

export function membersQuery(querystring: MemberListQuery) {
  return queryOptions({
    placeholderData: keepPreviousData,
    queryFn: () => fetchMembers(querystring),
    queryKey: ["members", "list", querystring]
  });
}

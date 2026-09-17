import { keepPreviousData, queryOptions } from "@tanstack/react-query";

import { memberSort } from "@sanity/api";

import { api } from "@/lib/api/client.js";

export type MemberSort = (typeof memberSort.options)[number];

export type MemberStatus = "active" | "all" | "inactive";

export const toActive = (status: MemberStatus) => {
  if (status === "active") return true;
  if (status === "inactive") return false;
};

// The contract has no `member` type export, so it's derived from the client call itself.
type MembersListResult = Awaited<ReturnType<typeof api.members.list>>;
export type Member = MembersListResult["body"]["items"][number];
export type MembersPage = MembersListResult["body"]["page"];

type MembersQueryParams = {
  active?: boolean;
  limit: number;
  offset: number;
  order: "asc" | "desc";
  sort: MemberSort;
};

async function fetchMembers(params: MembersQueryParams) {
  const result = await api.members.list({ querystring: params });
  if (result.status !== 200) throw new Error("Failed to load members");
  return result.body;
}

export function membersQuery(params: MembersQueryParams) {
  return queryOptions({
    placeholderData: keepPreviousData,
    queryFn: () => fetchMembers(params),
    queryKey: ["members", "list", params]
  });
}

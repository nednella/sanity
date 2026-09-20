export type MemberStatus = "active" | "all" | "inactive";

// The API filters on a boolean or not at all, so "all" is the absent case.
export const toActive = (status: MemberStatus) => {
  if (status === "active") return "true" as const;
  if (status === "inactive") return "false" as const;
};

import { createContext, useContext } from "react";

import type { MemberProfile } from "@sanity/api";

export type Auth = {
  isLoading: boolean;
  logout: () => void;
  member: MemberProfile | undefined;
};

export const AuthContext = createContext<Auth | null>(null);

export function useAuth() {
  const auth = useContext(AuthContext);
  if (!auth) throw new Error("useAuth must be used inside an AuthProvider");

  return auth;
}

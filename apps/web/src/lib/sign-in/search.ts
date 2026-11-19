import type { SearchSchemaInput } from "@tanstack/react-router";

const SIGN_IN_STATES = ["failed", "not-a-member", "open"] as const;

export type SignInState = (typeof SIGN_IN_STATES)[number];

export type SignInSearch = {
  signIn?: SignInState;
};

export function validateSignInSearch(search: Record<string, unknown> & SearchSchemaInput): SignInSearch {
  const signIn = search.signIn as SignInState;
  return { signIn: SIGN_IN_STATES.includes(signIn) ? signIn : undefined };
}
